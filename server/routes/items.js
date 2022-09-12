"use strict";

/** Routes for items. */

const jsonschema = require("jsonschema");
const express = require("express");

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Item = require("../models/item");
const stripe = require("stripe")(
  "sk_test_51LgaXPLlKfZiJaI1wZ8brUMaTZ0P8GvarexbVQm5IG54CynzmwkU8Qw2TapGETauIORmaHdxBlap0ZbknuubAu6C009JPLkZfQ"
);

const itemNewSchema = require("../schemas/itemNew.json");
const itemPurchaseSchema = require("../schemas/itemPurchase.json");
const itemUpdateSchema = require("../schemas/itemUpdate.json");

const router = new express.Router();

/** POST / { item } =>  { item }
 *
 * item should be { categories,
    title,
    imageUrl,
    quantity,
    price,
    description, }
  *
    where categories = [category,...]
 *
 * Returns {[{category},...],id,title, image_url,quantity,price,description}
 *
 * Authorization required: admin
 */
router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, itemNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.create(req.body);
    return res.status(201).json({ item });
  } catch (e) {
    return next(e);
  }
});

/** GET /[id]  =>
 *   { item: item }
 * * item should be { categories,
    title,
    imageUrl,
    quantity,
    price,
    description, }
  *
    where categories = [category,...]
 *
 * Returns {[{category},...],id,title, image_url,quantity,price,description}
 *
 * Authorization required: none
 */
router.get("/:id", async function (req, res, next) {
  try {
    const item = await Item.get(req.params.id);
    return res.json({ item });
  } catch (e) {
    return next(e);
  }
});

/**POST /[id]/purchase {quantity} =>{item}
 *
 * Decrease quantity when customer purchase item
 *
 * Returns {[{category},...],id,title, image_url,quantity,price,description}
 *
 * Authorization required: login
 */

router.post("/:id/purchase", ensureLoggedIn, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, itemPurchaseSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const itemId = await Item.purchase(req.params.id, req.body);
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: itemId,
          quantity: req.body.amount,
        },
      ],
      mode: "payment",
      success_url: "/items/success",
      cancel_url: "/items/cancel",
    });
    return res.json({ url: session.url });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /[id] { fld1, fld2, ... } => { item }
 *
 * Patches category data.
 *
 * fields can be: { categories,
    title,
    imageUrl,
    quantity,
    price,
    description, }
 *
 * Returns {[{category},...],id,title, image_url,quantity,price,description}
 *
 * Authorization required: admin
 */

router.patch("/:id", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, itemUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }

    const item = await Item.update(req.params.id, req.body);
    return res.json({ item });
  } catch (e) {
    return next(e);
  }
});

/** DELETE /[id]  =>  { deleted: itemid }
 *
 * Authorization: admin
 */

router.delete("/:id", ensureAdmin, async function (req, res, next) {
  try {
    await Item.remove(req.params.id);
    return res.json({ deleted: req.params.id });
  } catch (e) {
    return next(e);
  }
});

module.exports = router;
