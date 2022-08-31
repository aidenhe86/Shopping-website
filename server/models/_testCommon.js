const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

const testItemIds = [];
async function commonBeforeAll() {
  await db.query("DELETE FROM items");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM item_category");

  // insert category
  let catRes = await db.query(`
    INSERT INTO categories(category, image_url)
    VALUES ('category1', 'http://c1.img'),
           ('category2', 'http://c2.img'),
           ('category3', 'http://c3.img')
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
                      stripe_id)
    VALUES ('u1', $1, 'U1F', 'U1L', 'u1@email.com','customerID1'),
           ('u2', $2, 'U2F', 'U2L', 'u2@email.com','')
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
                      description)
    VALUES ('item1','http://i1.img',100,3,'test item1'),
          ('item2','http://i2.img',200,7,'test item2')
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
