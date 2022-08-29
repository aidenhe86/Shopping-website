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
  u2Token,
  adminToken,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /categories */

describe("POST /categories", function () {
  const newCategory = {
    category: "new",
    imageUrl: "http://new.img",
  };

  test("ok for admin", async function () {
    const resp = await request(app)
      .post("/categories")
      .send(newCategory)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual({
      category: newCategory,
    });
  });

  test("fail for user", async function () {
    const resp = await request(app)
      .post("/categories")
      .send(newCategory)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/categories")
      .send({
        imageUrl: "http://new.img",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/categories")
      .send({
        ...newCategory,
        imageUrl: "not-url",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** GET /categories */

describe("GET /categories", function () {
  test("ok for anon", async function () {
    const resp = await request(app).get("/categories");
    expect(resp.body).toEqual({
      categories: [
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
        {
          category: "category4",
          imageUrl: "http://c4.img",
        },
      ],
    });
  });
});

/************************************** GET /categories/:category */

describe("GET /categories/:category", function () {
  test("works for anon", async function () {
    const resp = await request(app).get(`/categories/category1`);
    expect(resp.body).toEqual({
      category: {
        category: "category1",
        imageUrl: "http://c1.img",
        items: [
          {
            id: expect.any(Number),
            title: "i1",
            imageUrl: "http://i1.img",
            quantity: 100,
            price: "1.00",
            description: "test item 1",
          },
          {
            id: expect.any(Number),
            title: "i3",
            imageUrl: "http://i3.img",
            quantity: 3300,
            price: "8.49",
            description: "test item 3",
          },
        ],
      },
    });
  });

  test("works for anon: category w/o items", async function () {
    const resp = await request(app).get(`/categories/category4`);
    expect(resp.body).toEqual({
      category: {
        category: "category4",
        imageUrl: "http://c4.img",
        items: [],
      },
    });
  });

  test("not found for no such category", async function () {
    const resp = await request(app).get(`/categories/nope`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /categories/:category */

describe("PATCH /categories/:category", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .patch(`/categories/category1`)
      .send({
        category: "C1-new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({
      category: {
        category: "C1-new",
        imageUrl: "http://c1.img",
      },
    });
  });

  test("fail for users", async function () {
    const resp = await request(app)
      .patch(`/categories/category1`)
      .send({
        category: "C1-new",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).patch(`/categories/category1`).send({
      category: "C1-new",
    });
    expect(resp.statusCode).toEqual(401);
  });

  test("not found on no such category", async function () {
    const resp = await request(app)
      .patch(`/categories/notfound`)
      .send({
        category: "C1-new",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });

  test("bad request on invalid data", async function () {
    const resp = await request(app)
      .patch(`/categories/category1`)
      .send({
        notExist: "not exist",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});

/************************************** DELETE /categories/:category */

describe("DELETE /companies/:handle", function () {
  test("works for admin", async function () {
    const resp = await request(app)
      .delete(`/categories/category1`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.body).toEqual({ deleted: "category1" });
  });

  test("fail for users", async function () {
    const resp = await request(app)
      .delete(`/categories/category1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/categories/category1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found for no such company", async function () {
    const resp = await request(app)
      .delete(`/categories/notfound`)
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(404);
  });
});
