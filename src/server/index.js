const express = require("express");
const app = express();
const cors = require("cors");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

const shipperController = require("./controllers/shipperController");
app.use(shipperController);

const menuController = require("./controllers/menuController");
app.use(menuController);

const orderController = require("./controllers/orderController");
app.use(orderController);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
