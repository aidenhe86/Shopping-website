CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(25) UNIQUE,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL
    CHECK (position('@' IN email) > 1) UNIQUE,
  stripe_id TEXT UNIQUE,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
    category VARCHAR(25) UNIQUE CHECK (category = lower(category))
);

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT,
    quantity INTEGER NOT NULL DEFAULT 100,
    price DECIMAL (9,2) NOT NULL
);

CREATE TABLE item_category(
  category_id INTEGER REFERENCES categories ON DELETE CASCADE,
  title_id INTEGER REFERENCES items ON DELETE CASCADE,
  PRIMARY KEY(category_id, title_id)
);