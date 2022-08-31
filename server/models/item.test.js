const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Item = require("./item.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testItemIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// create an item
describe("create items", function () {
  let newItem = {
    categories: ["category1", "category3"],
    title: "new",
    imageUrl: "http://new.img",
    quantity: 1000,
    price: "4.56",
    description: "New Item",
  };

  test("works", async function () {
    let item = await Item.create(newItem);
    expect(item).toEqual({
      title: "new",
      imageUrl: "http://new.img",
      quantity: 1000,
      price: "4.56",
      description: "New Item",
      id: expect.any(Number),
      categories: [{ category: "category1" }, { category: "category3" }],
    });

    const result = await db.query(
      `SELECT id, title, quantity, price, description, image_url AS "imageUrl"
            FROM items
            WHERE title = 'new'`
    );
    expect(result.rows).toEqual([
      {
        title: "new",
        imageUrl: "http://new.img",
        quantity: 1000,
        price: "4.56",
        description: "New Item",
        id: item.id,
      },
    ]);
    const m2m = await db.query(
      `SELECT * FROM item_category WHERE item_id = $1`,
      [item.id]
    );
    expect(m2m.rows).toEqual([
      { category_id: expect.any(Number), item_id: item.id },
      { category_id: expect.any(Number), item_id: item.id },
    ]);
  });

  test("bad request with dupe", async () => {
    try {
      await Item.create(newItem);
      await Item.create(newItem);
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("bad request with empty category", async () => {
    try {
      await Item.create({
        categories: [],
        title: "new",
        imageUrl: "http://new.img",
        quantity: 1000,
        price: "4.56",
        description: "New Item",
      });
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });

  test("not found with not exist category", async () => {
    try {
      await Item.create({
        categories: ["nope"],
        title: "new",
        imageUrl: "http://new.img",
        quantity: 1000,
        price: "4.56",
        description: "New Item",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

//  get an item
describe("get", function () {
  test("works", async function () {
    let item = await Item.get(testItemIds[0]);
    expect(item).toEqual({
      id: testItemIds[0],
      title: "item1",
      imageUrl: "http://i1.img",
      quantity: 100,
      price: "3.00",
      description: "test item1",
      categories: [{ category: "category1" }, { category: "category2" }],
    });
  });

  test("fail: not found item id", async function () {
    try {
      await Item.get(0);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

// purchase an item
describe("purchase", function () {
  test("works", async function () {
    let item = await Item.purchase(testItemIds[0], { amount: 10 });
    expect(item).toEqual({
      id: expect.any(Number),
      title: "item1",
      imageUrl: "http://i1.img",
      quantity: 90,
      price: "3.00",
      description: "test item1",
    });
  });

  test("fail: not valid id", async function () {
    try {
      await Item.purchase(0, { amount: 10 });
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });

  test("fail: exceed quantity", async function () {
    try {
      await Item.purchase(testItemIds[0], { amount: 200 });
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });

  test("fail: invalid data", async function () {
    try {
      await Item.purchase(testItemIds[0], { amount: "not a number" });
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });
});

// update an item
describe("update", function () {
  const updateData = {
    categories: ["category1", "category3"],
    title: "test",
    quantity: 500,
    price: "3.14",
  };

  test("works", async function () {
    let item = await Item.update(testItemIds[0], updateData);
    expect(item).toEqual({
      id: testItemIds[0],
      ...updateData,
      imageUrl: "http://i1.img",
      description: "test item1",
      categories: [{ category: "category1" }, { category: "category3" }],
    });
  });

  test("fail: item not found", async function () {
    try {
      await Item.update(0, updateData);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });

  test("fail:bad request with no data", async function () {
    try {
      await Item.update(testItemIds[0], {});
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });

  test("fail:bad request with no category", async function () {
    try {
      await Item.update(testItemIds[0], { ...updateData, categories: [] });
      fail();
    } catch (e) {
      expect(e instanceof BadRequestError).toBeTruthy();
    }
  });

  test("fail if not found category", async function () {
    try {
      await Item.update(testItemIds[0], {
        ...updateData,
        categories: ["not exist category"],
      });
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

describe("delete", function () {
  test("works", async function () {
    await Item.remove(testItemIds[0]);
    const res = await db.query(
      `SELECT * FROM items WHERE id = ${testItemIds[0]}`
    );
    expect(res.rows.length).toEqual(0);
  });

  test("fail:delete not exist item", async function () {
    try {
      await Item.remove(0);
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
