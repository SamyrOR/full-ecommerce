import express from "express";
import cors from "cors";
import data from "./data";

const app = express();

app.use(cors("http://localhost:8080/"));

app.get("/api/products", (req, res) => {
  res.send(data.products);
});
app.get("/api/products/:id", (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: "Product Not Found!" });
  }
});

app.listen(8000, () => console.log("Server at http://localhost:8000"));
