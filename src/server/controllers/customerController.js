const express = require("express");
const db = require("../database");
const bcrypt = require('bcrypt');

const customerController = express.Router();

// Route to handle creating a new customer
customerController.post("/customer/create", (req, res) => {
    let { name, phoneNumber,email,password,address } = req.body;
    const rankID = 1;
    const allSpend = 0;
    password = bcrypt.hashSync(password,10);
    // Insert the customer into the database
    db.query(
      "INSERT INTO Customer (rankID, name, password, phoneNumber, email, address, allSpend) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [rankID,name,password, phoneNumber, email, address, allSpend],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error creating customer");
        } else {
          const newCustomer = {
            customerID: result.insertId, // Get the auto-generated ID
            rankID,
            name,
            password,
            phoneNumber,
            email,
            address,
            allSpend,
          };
          res.status(201).json(newCustomer); // Return the new customer object
        }
      }
    );
  });

// Route to fetch all customer
customerController.get("/customer/all", (req, res) => {
  // Fetch all customer from the database
  db.query("SELECT * FROM Customer", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching customer");
    } else {
      res.json(result);
    }
  });
});

// Route to handle deleting a customer
customerController.delete("/customer/delete/:customerID", (req, res) => {
    const customerID = req.params.customerID;
  
    // Delete the shipper from the database
    db.query(
      "DELETE FROM Customer WHERE customerID = ?",
      customerID,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error deleting customer");
        } else {
          res.send(result);
        }
      }
    );
  });


  customerController.put("/customer/update/:customerID", (req, res) => {
    const customerID = req.params.customerID;
    let { name, phoneNumber, email, password, address} = req.body;
    let hashPassword = bcrypt.hashSync(password,10);
    console.log(password);
    // Update the staff in the database
    db.query(
      "UPDATE Customer SET name = ?, email = ?, phoneNumber = ?, password = ?, address = ? WHERE customerID = ?",
      [name, email, phoneNumber, hashPassword, address, customerID],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error updating customer");
        } else {
          res.send(result);
        }
      }
    );
  });

module.exports=customerController;