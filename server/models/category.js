"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");
const { sqlForPartialUpdate } = require("../helpers/sql");

/** Related functions for categories. */

class Category {
  /** Create a new category and return category,
   * Returns {category, imageUrl},
   * Throws BadRequestError if category already in database.
   */
  static async create({ category, imageUrl = "some default picture" }) {
    const duplicateCheck = await db.query(
      `SELECT category
             FROM categories
             WHERE category = $1`,
      [category]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate category: ${category}`);

    const result = await db.query(
      `INSERT INTO categories (category,image_url) VALUES ($1,$2)
            RETURNING category, image_url AS "imageUrl"`,
      [category, imageUrl]
    );
    return result.rows[0];
  }

  /** Find all categories
   * Returns [{category,imageUrl},...]
   */
  static async findAll() {
    const result = await db.query(
      `SELECT category, image_url AS "imageUrl" 
      FROM categories ORDER BY category`
    );
    return result.rows;
  }

  /** Given a category, return all items under that category
   * Returns {category,imageUrl, items}
   *    where items is [{id,title,image_url,quantity, price, description},...]
   *
   * Throws NotFoundError if not found.
   */
  static async get(category) {
    const categoryRes = await db.query(
      `SELECT category, image_url AS "imageUrl"
        FROM categories
        WHERE category = $1`,
      [category]
    );

    const cat = categoryRes.rows[0];
    if (!cat) throw new NotFoundError(`No category: ${category}`);

    const itemsRes = await db.query(
      `SELECT i.id,
              i.title,
              i.image_url AS "imageUrl", 
              i.quantity, 
              i.price,
              i.description,
              i.price_id as "priceId"
        FROM 
            item_category ic
            JOIN items i ON ic.item_id = i.id
            JOIN categories c ON ic.category_id = c.id
        WHERE c.category = $1 
        ORDER BY i.title`,
      [category]
    );
    cat.items = itemsRes.rows;
    return cat;
  }
  /** Update category data
   * Returns {category,imageUrl}
   * Throw NotFoundError if not found.
   */
  static async update(category, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      imageUrl: "image_url",
    });
    const catVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE categories
                      SET ${setCols}
                      WHERE category = ${catVarIdx}
                      RETURNING category, image_url AS "imageUrl"`;
    const result = await db.query(querySql, [...values, category]);
    const newCat = result.rows[0];
    if (!newCat) throw new NotFoundError(`No category: ${category}`);

    return newCat;
  }

  /** Delete given category from database; returns undefined.
   *
   * Throws NotFoundError if category not found.
   **/
  static async remove(category) {
    const result = await db.query(
      `DELETE
           FROM categories
           WHERE category = $1
           RETURNING category`,
      [category]
    );
    const cat = result.rows[0];

    if (!cat) throw new NotFoundError(`No category: ${category}`);
  }
}

module.exports = Category;
