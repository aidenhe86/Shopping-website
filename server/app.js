"use strict";

const path = require("path");

const express = require("express");
const cors = require("cors");

const { NotFoundError } = require("./expressError");
const { authenticateJWT } = require("./middleware/auth");
const authRoutes = require("./routes/auth");
const usersRoutes = require("./routes/users");
const categoriesRoutes = require("./routes/categories");
const itemsRoutes = require("./routes/items");

const app = express();

// serve static files generated by CRA
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// prefix all API endpoints with `/api` for CRA
app.get("/api/ping", async function (req, res) {
  res.send("Ok");
});

// allows to indicate any origins (domain, scheme, or port) other than its own from which a browser should permit loading resources
app.use(cors());
// parses incoming JSON requests and puts the parsed data in req, and save raw data into req.rawBody
app.use(
  express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(authenticateJWT);

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/categories", categoriesRoutes);
app.use("/items", itemsRoutes);

if (process.env.NODE_ENV !== "dev") {
  // Catch-All for any request that doesn't match a route
  // falls back to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

/** Handle 404 errors -- this matches everything */
app.use(function (req, res, next) {
  return next(new NotFoundError());
});

/** Generic error handler; anything unhandled goes here. */
app.use(function (err, req, res, next) {
  if (process.env.NODE_ENV !== "test") console.error(err.stack);
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    error: { message, status },
  });
});

module.exports = app;
