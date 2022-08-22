"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

class Item {
  /**Create a new item and return new item data
   * accpet {[category,...],title, image_url,quantity,price,description}
   * return {[category,...],id,title, image_url,quantity,price,description}
   */
  static async create({
    categories,
    title,
    imageUrl = "some default image url",
    quantity,
    price,
    description,
  }) {
    const catID = [];

    // precheck for categories if not exist
    for (let category of categories) {
      let preCheckCat = await db.query(
        `SELECT id, category FROM categories WHERE category = $1`,
        [category]
      );
      let preCheck1 = preCheckCat.rows[0];
      if (!preCheck1) throw new NotFoundError(`No category:${category} Found!`);
      // save category id if found
      catID.push(preCheck1.id);
    }

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
        (title, image_url, quantity,price, descriptipn) 
        VALUES($1,$2,$3,$4,$5) 
        RETURNING id,title,image_url,quantity,price,description`,
      [title, imageUrl, quantity, price, description]
    );
    const newItem = result.rows[0];
    const itemID = newItem.id;

    // insert into many to many relationship table
    for (let cID of catID) {
      await db.query(
        `INSERT INTO item_category
            (category_id,item_id)
            VALUES($1,$2)`,
        [cID, itemID]
      );
    }
    return { categories, ...newItem };
  }

  /** Given a item id, return that item data
   * Returns {categories, title,image_url,quantity, price, description}
   * where categories = [category,...]
   * Throws NotFoundError if not found.
   */
  static async get(id) {
    const itemRes = await db.query(
      `SELECT  
            title, 
            image_url AS imageUrl, 
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
        WHERE i.title = $1
        ORDER BY c.category`,
      [title]
    );

    item.categories = catRes.rows;
    return item;
  }

  /** Update item data
   * Returns {[category,...],id,title, image_url,quantity,price,description}
   */
  static async update(id, data, categories) {
    // update item info
    const { setCols, values } = sqlForPartialUpdate(data, {
      imageUrl: "image_url",
    });
    const itemVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE items
                      SET ${setCols}
                      WHERE id = ${itemVarIdx}
                      RETURNING id,
                                title, 
                                image_url AS imageUrl,
                                quantity,
                                price,
                                description`;
    const result = await db.query(querySql, [...values, id]);
    const newItem = result.rows[0];
    if (!newItem) throw new NotFoundError(`No Item ID: ${id}`);

    // precheck for categories if not exist
    const catID = [];

    for (let category of categories) {
      let preCheckCat = await db.query(
        `SELECT id, category FROM categories WHERE category = $1`,
        [category]
      );
      let preCheck1 = preCheckCat.rows[0];
      if (!preCheck1) throw new NotFoundError(`No category:${category} Found!`);
      // save category id if found
      catID.push(preCheck1.id);
    }

    // delete all previous m2m relationship
    await db.query(
      `DELETE
           FROM item_category
           WHERE item_id = $1`,
      [id]
    );

    // insert all new m2m relationship
    for (let cID of catID) {
      await db.query(
        `INSERT INTO item_category
            (category_id,item_id)
            VALUES($1,$2)`,
        [cID, id]
      );
    }

    return { categories, ...newItem };
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
