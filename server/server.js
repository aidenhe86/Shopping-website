"use strict";

const app = require("./app");
const { PORT } = require("./config");

app.listen(PORT, () => {
  console.log(`Shopping app listening at http://localhost:${PORT}`);
});
