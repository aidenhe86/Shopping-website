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

  /** Given a title, return that item data
   * Returns {title,image_url,quantity, price, description}
   * Throws NotFoundError if not found.
   */
  static async get(title) {
    const itemRes = await db.query(
      `SELECT  
            title, 
            image_url AS imageUrl, 
            quantity,
            price,
            description
        FROM items
        WHERE title = $1`,
      [title]
    );
    const item = itemRes.rows[0];
    if (!item) throw new NotFoundError(`No Item:${title} found!`);

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
  static async update(title, data, categories) {
    // update item info
    const { setCols, values } = sqlForPartialUpdate(data, {
      imageUrl: "image_url",
    });
    const titleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE items
                      SET ${setCols}
                      WHERE title = ${titleVarIdx}
                      RETURNING category, image_url AS imageUrl`;
    const result = await db.query(querySql, [...values, title]);
    const newItem = result.rows[0];
    if (!newItem) throw new NotFoundError(`No Item: ${title}`);

    return newItem;
  }
}

module.exports = Item;
