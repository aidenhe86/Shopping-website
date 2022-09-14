CREATE TABLE users (
  username VARCHAR(25) PRIMARY KEY,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1),
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
    category TEXT UNIQUE NOT NULL,
    image_url TEXT
);

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    title TEXT UNIQUE NOT NULL,
    image_url TEXT,
    quantity INTEGER NOT NULL DEFAULT 100,
    price DECIMAL (9,2) NOT NULL,
    description TEXT,
    product_id TEXT NOT NULL,
    price_id TEXT NOT NULL
);

CREATE TABLE item_category(
  category_id INTEGER REFERENCES categories ON DELETE CASCADE,
  item_id INTEGER REFERENCES items ON DELETE CASCADE,
  PRIMARY KEY(category_id, item_id)
);

CREATE TABLE user_order(
  id SERIAL PRIMARY KEY,
  username VARCHAR(25)
    REFERENCES users ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  payment BOOLEAN NOT NULL DEFAULT FALSE
)