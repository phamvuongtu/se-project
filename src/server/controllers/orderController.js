const express = require("express");
const db = require("../database");

const orderController = express.Router();

// Route to create a new order
// orderController.post("/order/create", async (req, res) => {
//   try {
//     const {
//       customerID,
//       shipperID,
//       shipType,
//       totalPrice,
//       status,
//       customerName,
//       phoneNumber,
//       address,
//       deliveryNote,
//       orderRows,
//     } = req.body;
//     const orderTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
//     const orderInsertQuery = `INSERT INTO Order_Info (customerID, shipperID, shipType, totalPrice, status, customerName, phoneNumber, address, deliveryNote, order_time) 
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
//   const orderInsertValues = [
//     customerID,
//     shipperID,
//     shipType,
//     orderTime,
//     totalPrice,
//     status,
//     customerName,
//     phoneNumber,
//     address,
//     deliveryNote,
//   ];
  
//     const result = await db.query(orderInsertQuery, orderInsertValues);
//     const orderID = result.insertId;

//     const orderItemsInsertQuery = `INSERT INTO Order_Supply (fProductID, orderID, quantity, fever) VALUES (?, ?, ?, ?)`;

//     for (const orderRow of orderRows) {
//       const { fProductID, quantity, fever } = orderRow;
//       await db.query(orderItemsInsertQuery, [
//         fProductID,
//         orderID,
//         quantity,
//         fever,
//       ]);
//     }

//     res.status(201).json({ orderID });
//   } catch (error) {
//     console.error("Error creating order:", error);
//     res.status(500).send("Error creating order");
//   }
// });
orderController.post("/order/create", async (req, res) => {
  try {
    const {
      customerID,
      shipperID,
      shipType,
      status,
      customerName,
      phoneNumber,
      address,
      deliveryNote,
      orderRows,
    } = req.body;

    let totalPrice = 0;
    for (const orderRow of orderRows) {
      const fProductID = orderRow.fProductID;
      const getPriceQuery = `SELECT price FROM FProduct WHERE fProductID = ?`;
      const priceResult = await db.query(getPriceQuery, fProductID);

      if (priceResult.length === 0) {
        return res.status(400).send(`Price for fProductID ${fProductID} not found.`);
      }

      const price = priceResult[0].price;
      totalPrice += price * orderRow.quantity;
    }

    const orderTime = new Date().toISOString().slice(0, 19).replace('T', ' ');
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
      await db.query(orderItemsInsertQuery, [
        fProductID,
        orderID,
        quantity,
        fever,
      ]);
    }

    res.status(201).json({ orderID });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).send("Error creating order");
  }
});

// Route to fetch all orders
// orderController.get("/order/all", (req, res) => {
//   // Fetch all orders from the database
//   db.query("SELECT * FROM Order_Info", (err, result) => {
//     if (err) {
//       console.log(err);
//       res.status(500).send("Error fetching orders");
//     } else {
//       const orders = result.map((row) => ({
//         orderID: row.orderID,
//         customerID: row.customerID,
//         shipperID: row.shipperID,
//         shipType: row.shipType,
//         order_time: row.order_time.toISOString(),
//         totalPrice: row.totalPrice,
//         status: row.Status,
//         customerName: row.customerName,
//         phoneNumber: row.phoneNumber,
//         address: row.address,
//         deliveryNote: row.deliveryNote,
//       }));

//       res.json(orders);
//     }
//   });
// });
orderController.get("/order/all", async (req, res) => {
  try {
    // Fetch all orders from the database
    const ordersQuery = "SELECT * FROM Order_Info";
    const ordersResult = await db.query(ordersQuery);

    if (!Array.isArray(ordersResult)) {
      console.error("Orders result is not an array:", ordersResult);
      res.status(500).send("Error fetching orders");
      return;
    }

    const orders = [];

    for (const orderRow of ordersResult) {
      const order = {
        orderID: orderRow.orderID,
        customerID: orderRow.customerID,
        shipperID: orderRow.shipperID,
        shipType: orderRow.shipType,
        order_time: orderRow.order_time.toISOString(),
        totalPrice: orderRow.totalPrice,
        status: orderRow.Status,
        customerName: orderRow.customerName,
        phoneNumber: orderRow.phoneNumber,
        address: orderRow.address,
        deliveryNote: orderRow.deliveryNote,
        orderRows: [],
      };

      orders.push(order);
    }

    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).send("Error fetching orders");
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
