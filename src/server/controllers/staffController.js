const express = require("express");
const db = require("../database");

const staffController = express.Router();

staffController.post("/staff/create", (req, res) => {
    const { name,email, phoneNumber} = req.body;
  
    // Insert the shipper into the database
    db.query(
      "INSERT INTO Staff (name, email, phoneNumber) VALUES (?, ?, ?)",
      [name, email, phoneNumber],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error creating staff");
        } else {
          const newStaff = {
            staffID: result.insertId, // Get the auto-generated ID
            name,
            email,
            phoneNumber,
          };
          res.status(201).json(newStaff); // Return the new staff object
        }
      }
    );
  });

staffController.get("/staff/all", (req, res) => {
    // Fetch all staff from the database
    db.query("SELECT * FROM Staff", (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error fetching staffs");
      } else {
        res.json(result);
      }
    });
  });
// Route to handle deleting a staff
staffController.delete("/staff/delete/:staffID", (req, res) => {
    const staffID = req.params.staffID;
  
    // Delete the staff from the database
    db.query(
      "DELETE FROM Staff WHERE staffID = ?",
      staffID,
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error deleting staff");
        } else {
          res.send(result);
        }
      }
    );
  });

  // Route to handle updating a staff
staffController.put("/staff/update/:staffID", (req, res) => {
    const staffID = req.params.staffID;
    const { name, email, phoneNumber } = req.body;
  
    // Update the staff in the database
    db.query(
      "UPDATE Staff SET name = ?, email = ?, phoneNumber = ? WHERE staffID = ?",
      [name, email, phoneNumber, staffID],
      (err, result) => {
        if (err) {
          console.log(err);
          res.status(500).send("Error updating staff");
        } else {
          res.send(result);
        }
      }
    );
  });
  
  module.exports=staffController;
  