"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken,
  testItemIds,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// POST an item
describe("POST /items", function () {
  const newItem = {
    categories: ["category1", "category2", "category3"],
    title: "test",
    imageUrl: "http://i3.img",
    quantity: 10000000,
    price: "5.55",
    description: "test item",
  };

  test("works for admin", async function () {
    const res = await request(app)
      .post("/items")
      .send(newItem)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({
      item: {
        ...newItem,
        id: expect.any(Number),
        categories: [
          { category: "category1" },
          { category: "category2" },
          { category: "category3" },
        ],
      },
    });
  });

  test("fail for user", async function () {
    const res = await request(app)
      .post("/items")
      .send(newItem)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("fail for missing data", async function () {
    const res = await request(app)
      .post("/items")
      .send({ title: "test" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test("fail for invalid data", async function () {
    const res = await request(app)
      .post("/items")
      .send({
        categories: ["category1", "category2", "category3"],
        title: "test",
        imageUrl: "noturl",
        quantity: "notquantity",
        price: "5.55",
        description: "test item",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

// purchase an item
describe("POST /items/:id/purchase", function () {
  test("works for users", async function () {
    const res = await request(app)
      .post(`/items/${testItemIds[0]}/purchase`)
      .send({ amount: 5 })
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.body).toEqual({
      item: {
        id: testItemIds[0],
        title: "i1",
        imageUrl: "http://i1.img",
        quantity: 95,
        price: "1.00",
        description: "test item 1",
      },
    });
  });

  test("works for admin", async function () {
    const res = await request(app)
      .post(`/items/${testItemIds[0]}/purchase`)
      .send({ amount: 5 })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      item: {
        id: testItemIds[0],
        title: "i1",
        imageUrl: "http://i1.img",
        quantity: 95,
        price: "1.00",
        description: "test item 1",
      },
    });
  });

  test("fail for anon", async function () {
    const res = await request(app)
      .post(`/items/${testItemIds[0]}/purchase`)
      .send({ amount: 5 });
    expect(res.statusCode).toEqual(401);
  });

  test("fail for exceed amount", async function () {
    const res = await request(app)
      .post(`/items/${testItemIds[0]}/purchase`)
      .send({ amount: 10000 })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test("fail for invalid input", async function () {
    const res = await request(app)
      .post(`/items/${testItemIds[0]}/purchase`)
      .send({ amount: "not a number" })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test("fail for not found item", async function () {
    const res = await request(app)
      .post(`/items/0/purchase`)
      .send({ amount: 10 })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});

// get an item
describe("GET /items/:id", function () {
  test("works for anao", async function () {
    const res = await request(app).get(`/items/${testItemIds[0]}`);
    expect(res.body).toEqual({
      item: {
        id: testItemIds[0],
        categories: [{ category: "category1" }, { category: "category2" }],
        title: "i1",
        imageUrl: "http://i1.img",
        quantity: 100,
        price: "1.00",
        description: "test item 1",
      },
    });
  });

  test("not found for no such item", async function () {
    const resp = await request(app).get(`/items/0`);
    expect(resp.statusCode).toEqual(404);
  });
});

// Patch an item
describe("PATCH /items/:id", function () {
  test("works for admin", async function () {
    const res = await request(app)
      .patch(`/items/${testItemIds[0]}`)
      .send({
        title: "newTitle",
        categories: ["category1", "category2"],
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({
      item: {
        id: testItemIds[0],
        categories: [{ category: "category1" }, { category: "category2" }],
        title: "newTitle",
        imageUrl: "http://i1.img",
        quantity: 100,
        price: "1.00",
        description: "test item 1",
      },
    });
  });

  test("fail for users", async function () {
    const res = await request(app)
      .patch(`/items/${testItemIds[0]}`)
      .send({
        title: "newTitle",
        categories: ["category1", "category2"],
      })
      .set("authorization", `Bearer ${u1Token}`);

    expect(res.statusCode).toEqual(401);
  });

  test("fail for anon", async function () {
    const res = await request(app)
      .patch(`/items/${testItemIds[0]}`)
      .send({
        title: "newTitle",
        categories: ["category1", "category2"],
      });
    expect(res.statusCode).toEqual(401);
  });

  test("fail for item not found", async function () {
    const res = await request(app)
      .patch(`/items/0`)
      .send({
        title: "newTitle",
        categories: ["category1", "category2"],
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });

  test("fail for bad request on empty category", async function () {
    const res = await request(app)
      .patch(`/items/${testItemIds[0]}`)
      .send({
        title: "newTitle",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });

  test("fail for bad request on invalid data", async function () {
    const res = await request(app)
      .patch(`/items/${testItemIds[0]}`)
      .send({
        imageUrl: "noturl",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(400);
  });
});

// DELETE an item
describe("DELETE /items/:id", function () {
  test("works for admin", async function () {
    const res = await request(app)
      .delete(`/items/${testItemIds[0]}`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.body).toEqual({ deleted: `${testItemIds[0]}` });
  });

  test("fail for users", async function () {
    const res = await request(app)
      .delete(`/items/${testItemIds[0]}`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(res.statusCode).toEqual(401);
  });

  test("fail for anon", async function () {
    const res = await request(app).delete(`/items/${testItemIds[0]}`);
    expect(res.statusCode).toEqual(401);
  });

  test("fail for jobs id not found", async function () {
    const res = await request(app)
      .delete(`/items/0`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toEqual(404);
  });
});
