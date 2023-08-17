const mysql = require("mysql");

// Create a MySQL database connection
const db = mysql.createConnection({
  user: "root",
  host: "localhost",
  password: "password",
  database: "software"
});

// Connect to the database
db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database: ", err);
  } else {
    console.log("Connected to the database");
  }
});

module.exports = db;
