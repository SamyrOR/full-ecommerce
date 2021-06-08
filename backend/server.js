const express = require("express");
const data = require("./data.js");
const cors = require("cors");
const app = express();

app.use(cors("http://127.0.0.1:5500/front-end/src/"));

app.get("/api/products", (req, res) => {
  res.send(data.products);
});

app.listen(8000, () => console.log("Server at http://localhost:8000"));
