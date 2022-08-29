"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Category = require("../models/category");
const Item = require("../models/item");
const { createToken } = require("../helpers/tokens");

async function commonBeforeAll() {
  await db.query("DELETE FROM items");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM item_category");

  await Category.create({
    category: "category1",
    imageUrl: "http://c1.img",
  });
  await Category.create({
    category: "category2",
    imageUrl: "http://c2.img",
  });
  await Category.create({
    category: "category3",
    imageUrl: "http://c3.img",
  });
  await Category.create({
    category: "category4",
    imageUrl: "http://c4.img",
  });

  await Item.create({
    categories: ["category1", "category2"],
    title: "i1",
    imageUrl: "http://i1.img",
    quantity: 100,
    price: "1.00",
    description: "test item 1",
  });

  await Item.create({
    categories: ["category2"],
    title: "i2",
    imageUrl: "http://i2.img",
    quantity: 200,
    price: "2.39",
    description: "test item 2",
  });

  await Item.create({
    categories: ["category1", "category2", "category3"],
    title: "i3",
    imageUrl: "http://i3.img",
    quantity: 3300,
    price: "8.49",
    description: "test item 3",
  });

  await User.register({
    username: "u1",
    firstName: "U1F",
    lastName: "U1L",
    email: "user1@user.com",
    password: "password1",
    isAdmin: false,
  });
  await User.register({
    username: "u2",
    firstName: "U2F",
    lastName: "U2L",
    email: "user2@user.com",
    password: "password2",
    isAdmin: false,
  });
  await User.register({
    username: "u3",
    firstName: "U3F",
    lastName: "U3L",
    email: "user3@user.com",
    password: "password3",
    isAdmin: false,
  });
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  adminToken,
};
