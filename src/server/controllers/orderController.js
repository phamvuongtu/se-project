const express = require("express");
const db = require("../database");

const orderController = express.Router();

// Route to create a new order
orderController.post('/order/create', async (req, res) => {
    try {
      const {
        customerID,
        shipperID,
        shipType,
        totalPrice,
        status,
        customerName,
        phoneNumber,
        address,
        deliveryNote,
        orderRows,
      } = req.body;
  
      const orderTime = new Date().toISOString();
  
      const orderInsertQuery = `INSERT INTO Order_Info (customerID, shipperID, shipType, totalPrice, status, customerName, phoneNumber, address, deliveryNote, order_time) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
      const orderInsertValues = [
        customerID,
        shipperID,
        shipType,
        totalPrice,
        status,
        customerName,
        phoneNumber,
        address,
        deliveryNote,
        orderTime,
      ];
  
      const result = await db.query(orderInsertQuery, orderInsertValues);
      const orderID = result.insertId;
  
      const orderItemsInsertQuery = `INSERT INTO Order_Supply (fProductID, orderID, quantity, fever) VALUES (?, ?, ?, ?)`;
  
      for (const orderRow of orderRows) {
        const { fProductID, quantity, fever } = orderRow;
        await db.query(orderItemsInsertQuery, [fProductID, orderID, quantity, fever]);
      }
  
      res.status(201).json({ orderID });
    } catch (error) {
      console.error('Error creating order:', error);
      res.status(500).send('Error creating order');
    }
  });

// Route to fetch all orders
orderController.get("/order/all", async (req, res) => {
    try {
      const query = "SELECT * FROM Order_Info";
      const [result] = await db.query(query); // Destructure the result
      
      const orders = result.map(row => ({
        orderID: row.orderID,
        customerID: row.customerID,
        shipperID: row.shipperID,
        shipType: row.shipType,
        order_time: row.order_time.toISOString(), // Format the datetime
        totalPrice: row.totalPrice,
        status: row.Status,
        customerName: row.customerName,
        phoneNumber: row.phoneNumber,
        address: row.address,
        deliveryNote: row.deliveryNote
      }));
      
      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).send("Error fetching orders");
    }
  });

// Route to update an order
orderController.put("/order/update/:orderID", async (req, res) => {
  try {
    const orderID = req.params.orderID;
    const {
      customerID,
      shipperID,
      shipType,
      totalPrice,
      status,
      customerName,
      phoneNumber,
      address,
      deliveryNote,
      orderRows
    } = req.body;

    // Update the order in the Order_Info table
    const orderUpdateQuery = `UPDATE Order_Info SET customerID = ?, shipperID = ?, shipType = ?, totalPrice = ?, status = ?, 
      customerName = ?, phoneNumber = ?, address = ?, deliveryNote = ? WHERE orderID = ?`;

    const orderUpdateValues = [
      customerID,
      shipperID,
      shipType,
      totalPrice,
      status,
      customerName,
      phoneNumber,
      address,
      deliveryNote,
      orderID
    ];

    await db.query(orderUpdateQuery, orderUpdateValues);

    // Update or insert order items in the Order_Supply table
    const orderItemsUpdateQuery = `INSERT INTO Order_Supply (fProductID, orderID, quantity, fever) 
      VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE quantity = VALUES(quantity), fever = VALUES(fever)`;

    for (const orderRow of orderRows) {
      const { fProductID, quantity, fever } = orderRow;
      await db.query(orderItemsUpdateQuery, [fProductID, orderID, quantity, fever]);
    }

    res.send("Order updated successfully");
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).send("Error updating order");
  }
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