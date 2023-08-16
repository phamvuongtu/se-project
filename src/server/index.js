// Import required libraries and modules
const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const PORT = 4000;

// Use CORS middleware to enable cross-origin requests
app.use(cors());

// Use JSON middleware to parse incoming JSON data
app.use(express.json());

// Create a MySQL database connection
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "software",
  insecureAuth: true, // For development purposes only
});

// Root URL route
app.get("/", (req, res) => {
  res.send("hello world");
});

// Route to handle creating a new shipper
app.post("/create", (req, res) => {
  const { name, phoneNumber } = req.body;

  // Insert the shipper into the database
  db.query(
    "INSERT INTO Shipper (name, phoneNumber) VALUES (?, ?)",
    [name, phoneNumber],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        const newShipper = {
          shipperID: result.insertId, // Get the auto-generated ID
          name,
          phoneNumber,
        };
        res.send(newShipper); // Return the new shipper object
      }
    }
  );
});

// Route to fetch all shippers
app.get("/all", (req, res) => {
  // Fetch all shippers from the database
  db.query("SELECT * FROM Shipper", (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

// Route to handle deleting a shipper
app.delete("/delete/:shipperID", (req, res) => {
  const shipperID = req.params.shipperID;
  
  // Delete the shipper from the database
  db.query(
    "DELETE FROM Shipper WHERE shipperID = ?",
    shipperID,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Route to handle updating a shipper
app.put("/update/:shipperID", (req, res) => {
  const shipperID = req.params.shipperID;
  const { name, phoneNumber } = req.body;

  // Update the shipper in the database
  db.query(
    "UPDATE Shipper SET name = ?, phoneNumber = ? WHERE shipperID = ?",
    [name, phoneNumber, shipperID],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

// Start the server
app.listen(process.env.PORT || PORT, () => {
  console.log("Yey, your server is running on port 4000");
});