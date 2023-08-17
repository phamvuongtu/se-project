const express = require("express");
const db = require("../database");

const shipperController = express.Router();

// Route to handle creating a new shipper
shipperController.post("/shipper/create", (req, res) => {
  const { name, phoneNumber } = req.body;

  // Insert the shipper into the database
  db.query(
    "INSERT INTO Shipper (name, phoneNumber) VALUES (?, ?)",
    [name, phoneNumber],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error creating shipper");
      } else {
        const newShipper = {
          shipperID: result.insertId, // Get the auto-generated ID
          name,
          phoneNumber,
        };
        res.status(201).json(newShipper); // Return the new shipper object
      }
    }
  );
});

// Route to fetch all shippers
shipperController.get("/shipper/all", (req, res) => {
  // Fetch all shippers from the database
  db.query("SELECT * FROM Shipper", (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching shippers");
    } else {
      res.json(result);
    }
  });
});

// Route to handle deleting a shipper
shipperController.delete("/shipper/delete/:shipperID", (req, res) => {
  const shipperID = req.params.shipperID;

  // Delete the shipper from the database
  db.query(
    "DELETE FROM Shipper WHERE shipperID = ?",
    shipperID,
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error deleting shipper");
      } else {
        res.send(result);
      }
    }
  );
});

// Route to handle updating a shipper
shipperController.put("/shipper/update/:shipperID", (req, res) => {
  const shipperID = req.params.shipperID;
  const { name, phoneNumber } = req.body;

  // Update the shipper in the database
  db.query(
    "UPDATE Shipper SET name = ?, phoneNumber = ? WHERE shipperID = ?",
    [name, phoneNumber, shipperID],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error updating shipper");
      } else {
        res.send(result);
      }
    }
  );
});

module.exports = shipperController;