const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testItemIds = [];
async function commonBeforeAll() {
  await db.query("DELETE FROM items");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM item_category");
  await db.query("DELETE FROM user_order");

  // insert category
  let catRes = await db.query(`
    INSERT INTO categories(category)
    VALUES ('category1'),
           ('category2'),
           ('category3')
    RETURNING id`);

  let catID = catRes.rows;

  // insert user
  await db.query(
    `
    INSERT INTO users(username,
                      password,
                      first_name,
                      last_name,
                      email,
                      address)
    VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com','address1'),
           ('u2', $2, 'U2F', 'U2L', 'u2@email.com','address2')
    RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  // insert items
  const itemRes = await db.query(
    `
    INSERT INTO items(title,
                      image_url,
                      quantity,
                      price,
                      description,
                      product_id,
                      price_id)
    VALUES ('item1','http://i1.img',100,3,'test item1','productid1','priceid1'),
          ('item2','http://i2.img',200,7,'test item2','productid2','priceid2')
    RETURNING id`
  );

  testItemIds[0] = itemRes.rows[0].id;
  testItemIds[1] = itemRes.rows[1].id;

  // item_category m2m relationship
  await db.query(`
      INSERT INTO item_category(category_id, item_id)
      VALUES(${catID[0].id},${testItemIds[0]}),
            (${catID[1].id},${testItemIds[1]}),
            (${catID[1].id},${testItemIds[0]})`);

  // insert user order
  await db.query(`
      INSERT INTO user_order(username,price_id,session_id,amount)
      VALUES('u1','priceid1','sessionid1',10),
            ('u2','priceid2','sessionid2',8)
  `);
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

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testItemIds,
};
