"use strict";

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
