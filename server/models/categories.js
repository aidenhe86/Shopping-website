"use strict";

const db = require("../db");
const { BadRequestError, NotFoundError } = require("../expressError");

/** Related functions for categories. */

class Category {
  /** Create a new category and return category,
   * Returns {category},
   * Throws BadRequestError if category already in database.
   */
  static async create(category) {
    const duplicateCheck = await db.query(
      `SELECT category
             FROM categories
             WHERE category = $1`,
      [category]
    );

    if (duplicateCheck.rows[0])
      throw new BadRequestError(`Duplicate category: ${category}`);

    const result = await db.query(
      `INSERT INTO categories (category) VALUES ($1)
            RETURNING category,`,
      [category]
    );
    return result.rows[0];
  }

  /** Find all categories
   * Returns [{category},...]
   */
  static async findAll() {
    const result = await db.query(
      `SELECT category FROM categories ORDER BY category`
    );
    return result.rows;
  }

  /** Given a category, return all items under that category
   * Returns {category, items}
   *    where items is [id,title,image_url,quantity, price]
   *
   * Throws NotFoundError if not found.
   */
  static async get(category) {
    const categoryRes = await db.query(
      `SELECT category
        FROM categories
        WHERE category = $1`,
      [category]
    );

    const cat = categoryRes.rows[0];
    if (!cat) throw new NotFoundError(`No category: ${category}`);

    const itemsRes = await db.query(
      `SELECT i.* 
        FROM 
            items i
            JOIN item_category ic ON ic.category_id = i.id
            JOIN category c ON ic.category_id = c.id
        ORDER BY i.title
        `
    );
    cat.items = itemsRes.rows;
    return cat;
  }
  /** Update category name
   * Returns {category}
   * Throw NotFoundError if not found.
   */
  static async update(category, newCategory) {
    const result = await db.query(
      `UPDATE categories
            SET category = $1
            WHERE category = $2
        RETURNING category`,
      [newCategory, category]
    );
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
