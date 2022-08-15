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
    type VARCHAR(25) PRIMARY KEY,
);

CREATE TABLE items(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    categories_type VARCHAR(25) NOT NULL REFERENCES categories ON DELETE CASCADE
);

CREATE TABLE purchase_history(

);