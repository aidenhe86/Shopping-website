"use strict";

/** Shared config for application; can be required many places. */

require("dotenv").config();
const ngrok = require("ngrok");

const SECRET_KEY = process.env.SECRET_KEY;

const PORT = +process.env.PORT || 4000;

(async function () {
  const url = await ngrok.connect({
    authtoken: process.env.NGROK_AUTHTOKEN,
    addr: PORT,
    host_header: PORT,
  });
})();

// Use dev database, testing database, or via env var, production database
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "shopping_test"
    : process.env.DATABASE_URL || "shopping";
}

const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
