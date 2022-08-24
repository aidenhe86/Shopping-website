const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Item = require("./item.js");
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

// create
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
      { category_id: 1, item_id: item.id },
      { category_id: 3, item_id: item.id },
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

describe("get", function () {
  test("works", async function () {
    let item = await Item.get(1);
    expect(item).toEqual({
      id: 1,
      title: "item1",
      imageUrl: "http://i1.img",
      quantity: 100,
      price: "3.00",
      description: "test item1",
      categories: [{ category: "category1" }, { category: "category2" }],
    });
  });

  test("works: not found item id", async function () {
    try {
      await Item.get(0);
      fail();
    } catch (e) {
      expect(e instanceof NotFoundError).toBeTruthy();
    }
  });
});

// describe("update", function () {
//   const updateData = {
//     title: "test",
//     quantity: 500,
//     price: "3.14",
//   };

//   test("works", async function () {
//     let item = await Item.update(1, updateData, ["categories"]);
//     expect(job).toEqual({
//       id: 1,
//       companyHandle: "c1",
//       ...updateData,
//     });
//   });

//   test("fail: job not found", async function () {
//     try {
//       await Job.update(0, updateData);
//       fail();
//     } catch (e) {
//       expect(e instanceof NotFoundError).toBeTruthy();
//     }
//   });

//   test("fail:bad request with no data", async function () {
//     try {
//       await Job.update(1, {});
//       fail();
//     } catch (e) {
//       expect(e instanceof BadRequestError).toBeTruthy();
//     }
//   });
// });

// describe("delete",function(){
//     test("works",async function(){
//         await Job.remove(1);
//         const res = await db.query("SELECT id FROM jobs WHERE id = 1");
//         expect(res.rows.length).toEqual(0);
//     })

//     test("fail:delete not exist job",async function(){
//         try{
//             await Job.remove(0);
//             fail();
//         }catch(err){
//             expect(err instanceof NotFoundError).toBeTruthy();
//         }
//     })
// });
