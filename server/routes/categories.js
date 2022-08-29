"use strict";

/** Routes for categories. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin } = require("../middleware/auth");
const Category = require("../models/category");

const categorySchema = require("../schemas/category.json");

const router = new express.Router();

/** POST / { category } =>  { category }
 *
 * category should be { category, imageUrl }
 *
 * Returns { category, imageUrl }
 *
 * Authorization required: admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, categorySchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const category = await Category.create(req.body);
    return res.status(201).json({ category });
  } catch (err) {
    return next(err);
  }
});

/** GET /  =>
 *   { categories: [{category,imageUrl},...] }
 *
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    const categories = await Category.findAll();
    return res.json({ categories });
  } catch (err) {
    return next(err);
  }
});

/** GET /[category]  =>  { category }
 *
 *  category is {category,imageUrl, items}
 *     where items is [{id,title,image_url,quantity, price},...]
 *
 * Authorization required: none
 */

router.get("/:category", async function (req, res, next) {
  try {
    const category = await Category.get(req.params.category);
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[category] { fld1, fld2, ... } => { category }
 *
 * Patches category data.
 *
 * fields can be: { category, image_url }
 *
 * Returns { category, image_url  }
 *
 * Authorization required: admin
 */

router.patch("/:category", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, categorySchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const category = await Category.update(req.params.category, req.body);
    return res.json({ category });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /[category]  =>  { deleted: category }
 *
 * Authorization: admin
 */

router.delete("/:category", ensureAdmin, async function (req, res, next) {
  try {
    await Category.remove(req.params.category);
    return res.json({ deleted: req.params.category });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
