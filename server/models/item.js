"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");
const stripe = require("stripe")(
  "sk_test_51LgaXPLlKfZiJaI1wZ8brUMaTZ0P8GvarexbVQm5IG54CynzmwkU8Qw2TapGETauIORmaHdxBlap0ZbknuubAu6C009JPLkZfQ"
);

class Item {
  /**Create a new item and return new item data
   * accpet {[category,...],title, image_url,quantity,price,description}
   * return {[{category},...],id,title, image_url,quantity,price,description}
   */
  static async create({
    categories,
    title,
    imageUrl = "some default image url",
    quantity,
    price,
    description,
  }) {
    // categories cannot be empty
    if (!categories.length)
      throw new BadRequestError(`Item must contain at least one category!`);

    const catID = [];

    // precheck for categories if not exist

    await Promise.all(
      categories.map(async (c) => {
        let preCheckCat = await db.query(
          `SELECT id, category FROM categories WHERE category = $1`,
          [c]
        );
        let preCheck1 = preCheckCat.rows[0];
        if (!preCheck1) throw new NotFoundError(`No category:${c} Found!`);
        catID.push(preCheck1.id);
      })
    );

    // precheck for items if created
    const preCheckItem = await db.query(
      `SELECT title FROM items WHERE title = $1`,
      [title]
    );
    const preCheck2 = preCheckItem.rows[0];
    if (preCheck2) throw new BadRequestError(`Item:${title} already created!`);

    // create items
    const result = await db.query(
      `INSERT INTO items
        (title, image_url, quantity,price, description) 
        VALUES($1,$2,$3,$4,$5) 
        RETURNING id,
                  title,
                  image_url AS "imageUrl",
                  quantity,
                  price,
                  description`,
      [title, imageUrl, quantity, price, description]
    );
    const newItem = result.rows[0];
    const itemID = newItem.id;

    // insert into many to many relationship table

    const m2mPromise = async (cID) => {
      await db.query(
        `INSERT INTO item_category
            (category_id,item_id)
            VALUES($1,$2)`,
        [cID, itemID]
      );
    };
    await Promise.all(catID.map((cID) => m2mPromise(cID)));

    const catRes = await db.query(
      `
        SELECT
            c.category
        FROM 
            item_category ic
            JOIN items i ON ic.item_id = i.id
            JOIN categories c ON ic.category_id = c.id
        WHERE i.id = $1
        ORDER BY c.category`,
      [itemID]
    );
    newItem.categories = catRes.rows;

    return newItem;
  }

  /** Given a item id, return that item data
   * Returns {categories, title,image_url,quantity, price, description}
   * where categories = [{category},...]
   * Throws NotFoundError if not found.
   */
  static async get(id) {
    const itemRes = await db.query(
      `SELECT
            id,  
            title, 
            image_url AS "imageUrl", 
            quantity,
            price,
            description
        FROM items
        WHERE id = $1`,
      [id]
    );
    const item = itemRes.rows[0];
    if (!item) throw new NotFoundError(`No Item ID:${id} found!`);

    const catRes = await db.query(
      `
        SELECT
            c.category
        FROM 
            item_category ic
            JOIN items i ON ic.item_id = i.id
            JOIN categories c ON ic.category_id = c.id
        WHERE i.id = $1
        ORDER BY c.category`,
      [id]
    );

    item.categories = catRes.rows;
    return item;
  }

  /**Purchase item
   * accpet {id,amount}
   *
   * Returns {categories,id,title, image_url,quantity,price,description}
   * where categories = [{category},...]
   */
  static async purchase(id, { amount }) {
    // precheck for input
    if (!Number.isInteger(amount))
      throw new BadRequestError(
        `Please enter the amount you want to purchase!`
      );

    // get item
    const itemRes = await db.query(
      `
      SELECT title, price, quantity FROM items WHERE id = $1`,
      [id]
    );
    const item = itemRes.rows[0];
    if (!item) throw new NotFoundError(`No Item ID:${id} found!`);

    // check if have enough stack available
    let remain = item.quantity - amount;
    if (remain < 0)
      throw new BadRequestError(
        `Currently ${item.title} only have ${item.quantity} available.`
      );

    // create stripe product
    const product = await stripe.products.create({ name: item.title });
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: item.price * 100,
      currency: "usd",
    });

    // update item quantity
    await db.query(
      `UPDATE items 
        SET quantity = $1 
        WHERE id = $2 `,
      [remain, id]
    );
    return price.id;
  }

  /** Update item data
   * accept {id,data}
   * where data is the item data will be update and categories
   *
   * Returns {categories,id,title, image_url,quantity,price,description}
   * where categories = [{category},...]
   */
  static async update(id, data) {
    // get categories from input data
    const categories = data.categories;
    // categories cannot be empty
    if (!categories || !categories.length)
      throw new BadRequestError(`Item must contain at least one category!`);

    // create a copy of data and remove categories
    const itemData = { ...data };
    delete itemData.categories;

    // precheck for categories
    const catID = [];

    const catPromise = async (c) => {
      let preCheckCat = await db.query(
        `SELECT id, category FROM categories WHERE category = $1`,
        [c]
      );
      let preCheck1 = preCheckCat.rows[0];
      if (!preCheck1) throw new NotFoundError(`No category:${c} Found!`);
      catID.push(preCheck1.id);
    };
    await Promise.all(categories.map((c) => catPromise(c)));

    // update item info
    const { setCols, values } = sqlForPartialUpdate(itemData, {
      imageUrl: "image_url",
    });
    const itemVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE items
                      SET ${setCols}
                      WHERE id = ${itemVarIdx}
                      RETURNING id,
                                title, 
                                image_url AS "imageUrl",
                                quantity,
                                price,
                                description`;
    const result = await db.query(querySql, [...values, id]);
    const newItem = result.rows[0];
    if (!newItem) throw new NotFoundError(`No Item ID: ${id}`);

    // delete all previous m2m relationship
    await db.query(
      `DELETE
           FROM item_category
           WHERE item_id = $1`,
      [id]
    );

    // insert all new m2m relationship
    const m2mPromise = async (cID) => {
      await db.query(
        `INSERT INTO item_category
            (category_id,item_id)
            VALUES($1,$2)
            RETURNING category_id AS "categoryId", 
                      item_id AS "itemId"`,
        [cID, id]
      );
    };
    await Promise.all(catID.map((cID) => m2mPromise(cID)));

    const catRes = await db.query(
      `
        SELECT
            c.category
        FROM 
            item_category ic
            JOIN items i ON ic.item_id = i.id
            JOIN categories c ON ic.category_id = c.id
        WHERE i.id = $1
        ORDER BY c.category`,
      [id]
    );
    newItem.categories = catRes.rows;

    return newItem;
  }
  /** Delete given item from database; returns undefined.
   *
   * Throws NotFoundError if item not found.
   **/

  static async remove(id) {
    const result = await db.query(
      `DELETE
      FROM items
      WHERE id = $1
      RETURNING id`,
      [id]
    );
    const item = result.rows[0];
    if (!item) throw new NotFoundError(`No Item ID:${id}`);
  }
}

module.exports = Item;
