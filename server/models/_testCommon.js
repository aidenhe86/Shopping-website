const bcrypt = require("bcrypt");

const db = require("../db.js");
const { BCRYPT_WORK_FACTOR } = require("../config");

async function commonBeforeAll() {
  await db.query("DELETE FROM items");
  await db.query("DELETE FROM categories");
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM item_category");

  // insert category
  await db.query(`
    INSERT INTO categories(id,category, image_url)
    VALUES (1,'category1', 'http://c1.img'),
           (2,'category2', 'http://c2.img'),
           (3,'category3', 'http://c3.img')`);

  // insert user
  await db.query(
    `
    INSERT INTO users(id,
                      username,
                      password,
                      first_name,
                      last_name,
                      email,
                      stripe_id)
    VALUES (1,'u1', $1, 'U1F', 'U1L', 'u1@email.com','customerID1'),
           (2,'u2', $2, 'U2F', 'U2L', 'u2@email.com','')
    RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  // insert items
  await db.query(
    `
    INSERT INTO items(id,
                      title,
                      image_url,
                      quantity,
                      price,
                      description)
    VALUES (1,'item1','http://i1.img',100,3,'test item1'),
          (2,'item2','http://i2.img',200,7,'test item2')`
  );

  // item_category m2m relationship
  await db.query(`
      INSERT INTO item_category(category_id, item_id)
      VALUES(1,1),
            (2,2),
            (2,1)`);
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
};
