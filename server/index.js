const path = require("path");
const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

// serve static files generated by CRA
app.use(express.static(path.join(__dirname, "..", "client", "build")));

// prefix all API endpoints with `/api`
app.get("/api/ping", function (req, res) {
  res.send("Ok");
});

if (process.env.NODE_ENV !== "dev") {
  // Catch-All for any request that doesn't match a route
  // falls back to index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});
