"use strict";

/** Routes for items. */

const jsonschema = require("jsonschema");
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_KEY);

const { BadRequestError } = require("../expressError");
const { ensureAdmin, ensureLoggedIn } = require("../middleware/auth");
const Item = require("../models/item");

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
 * Returns stripe payment url
 *
 * Authorization required: login
 */

router.post("/purchase", ensureLoggedIn, async function (req, res, next) {
  try {
    const line_items = [];

    for (let id in req.body) {
      line_items.push({
        price: req.body[id].priceId,
        quantity: req.body[id].amount,
      });
    }

    // const validator = jsonschema.validate(req.body, itemPurchaseSchema);
    // if (!validator.valid) {
    //   const errs = validator.errors.map((e) => e.stack);
    //   throw new BadRequestError(errs);
    // }

    // create stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${process.env.HOST_PORT}/items/success`,
      cancel_url: `${process.env.HOST_PORT}/items/cancel`,
    });
    // create order locally
    let username = req.locals?.user.username;
    Promise.all(
      line_items.map(async (i) => {
        await Item.order(username, i.price, i.quantity, session.id);
      })
    );

    return res.json({ url: session.url });
  } catch (err) {
    return next(err);
  }
});

async function fulfillOrder(session) {
  const paidOrder = await Item.paidOrder(session.id);
  Promise.all(
    paidOrder.map(async (order) => {
      await Item.purchase(order.priceId, order.amount);
    })
  );
}

// stripe webhook to detect when payment complete
router.post("/webhook", (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.endpointSecret
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return res.json({ "Webhook-Error": err.message });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    // Fulfill the purchase...
    fulfillOrder(session);
  }

  res.json({ Order: true });
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
