const express = require("express");
const db = require("../database");

const orderController = express.Router();

// Route to create a new order
orderController.post("/order/create", async (req, res) => {
  try {
    const newOrder = req.body;
    const orderRows = newOrder.orderRows; // Extract orderRows from the request

    // Create the order in the Order_Info table
    const insertOrderQuery = 'INSERT INTO Order_Info SET ?';
    const result = await db.query(insertOrderQuery, newOrder);

    const orderID = result.insertId;

    // Create order supply entries in the Order_Supply table
    const orderSupplyValues = orderRows.map((row) => [
      row.fProductID,
      orderID,
      row.quantity,
      row.fever || 'None'
    ]);
    const insertOrderSupplyQuery = 'INSERT INTO Order_Supply (fProductID, orderID, quantity, fever) VALUES ?';
    await db.query(insertOrderSupplyQuery, [orderSupplyValues]);

    res.status(201).json({ message: 'Order created successfully', orderID });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to fetch all orders
orderController.get("/order/all", (req, res) => {
  // Fetch all orders from the database
  db.query("SELECT * FROM Order_Info", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching orders");
    } else {
      const orders = result.map((row) => ({
        orderID: row.orderID,
        customerID: row.customerID,
        shipperID: row.shipperID,
        shipType: row.shipType,
        order_time: row.order_time.toISOString(),
        totalPrice: row.totalPrice,
        status: row.Status,
        customerName: row.customerName,
        phoneNumber: row.phoneNumber,
        address: row.address,
        deliveryNote: row.deliveryNote,
      }));

      res.json(orders);
    }
  });
});

// Route to delete an order
orderController.delete("/order/delete/:orderID", async (req, res) => {
  try {
    const orderID = req.params.orderID;

    // Delete the order from the Order_Info table
    const orderDeleteQuery = "DELETE FROM Order_Info WHERE orderID = ?";
    await db.query(orderDeleteQuery, orderID);

    // Delete the associated order items from the Order_Supply table
    const orderItemsDeleteQuery = "DELETE FROM Order_Supply WHERE orderID = ?";
    await db.query(orderItemsDeleteQuery, orderID);

    res.send("Order deleted successfully");
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).send("Error deleting order");
  }
});

module.exports = orderController;
