"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Category = require("./category.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
  const newCategory = {
    category: "testCategory",
    imageUrl: "http://new.img",
  };

  test("works", async function () {
    let category = await Category.create(newCategory);
    expect(category).toEqual(newCategory);

    const result = await db.query(
      `SELECT id, category, image_url AS "imageUrl"
           FROM categories
           WHERE category = 'testCategory'`
    );
    expect(result.rows).toEqual([
      {
        id: expect.any(Number),
        category: "testCategory",
        imageUrl: "http://new.img",
      },
    ]);
  });

  test("bad request with dupe", async function () {
    try {
      await Category.create(newCategory);
      await Category.create(newCategory);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works", async function () {
    let categories = await Category.findAll();
    expect(categories).toEqual([
      {
        category: "category1",
        imageUrl: "http://c1.img",
      },
      {
        category: "category2",
        imageUrl: "http://c2.img",
      },
      {
        category: "category3",
        imageUrl: "http://c3.img",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works", async function () {
    let category = await Category.get("category2");
    expect(category).toEqual({
      category: "category2",
      imageUrl: "http://c2.img",
      items: [
        {
          id: 1,
          title: "item1",
          imageUrl: "http://i1.img",
          quantity: 100,
          price: "3.00",
          description: "test item1",
        },
        {
          id: 2,
          title: "item2",
          imageUrl: "http://i2.img",
          quantity: 200,
          price: "7.00",
          description: "test item2",
        },
      ],
    });
  });

  test("not found if no such category", async function () {
    try {
      await Category.get("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    category: "New",
    imageUrl: "http://new.img",
  };

  test("works", async function () {
    let category = await Category.update("category1", updateData);
    expect(category).toEqual({
      ...updateData,
    });

    const result = await db.query(
      `SELECT id,
              category,
              image_url as "imageUrl" 
      FROM categories 
              WHERE category = 'New'`
    );
    expect(result.rows).toEqual([
      {
        id: 1,
        ...updateData,
      },
    ]);
  });

  test("not found if no such category", async function () {
    try {
      await Category.update("nope", updateData);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Category.update("category1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Category.remove("category1");
    const res = await db.query(
      "SELECT * FROM categories WHERE category = 'category1'"
    );
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such category", async function () {
    try {
      await Category.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
