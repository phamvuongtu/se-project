const express = require("express");
const db = require("../database");

const menuController = express.Router();
menuController.use(express.json());

// Route to handle creating a new product
menuController.post("/product/create", (req, res) => {
  const { name, description, size, price } = req.body;

  // Insert the product into the Product table
  db.query(
    "INSERT INTO Product (name, description) VALUES (?, ?)",
    [name, description],
    (productErr, productResult) => {
      if (productErr) {
        console.log(productErr);
        return res.status(500).send("Error creating product");
      }

      const productID = productResult.insertId;

      // Insert the corresponding fProduct into the FProduct table
      db.query(
        "INSERT INTO FProduct (productID, size, price) VALUES (?, ?, ?)",
        [productID, size, price],
        (fProductErr, fProductResult) => {
          if (fProductErr) {
            console.log(fProductErr);
            // Consider rolling back the Product insertion here if needed
            return res.status(500).send("Error creating fProduct");
          }

          const newFProduct = {
            fProductID: fProductResult.insertId,
            productID,
            size,
            price,
          };

          console.log("Newly inserted fProduct:", newFProduct);

          res.status(201).json({ productID, newFProduct });
        }
      );
    }
  );
});

// Route to fetch all products along with their fProducts
menuController.get("/product/all", (req, res) => {
  // Fetch all products along with their fProducts from the database
  db.query(
    "SELECT P.*, FP.fProductID, FP.size, FP.price FROM Product P LEFT JOIN FProduct FP ON P.productID = FP.productID",
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error fetching products");
      } else {
        const products = [];
        let currentProduct = null;

        for (const row of result) {
          if (
            currentProduct === null ||
            currentProduct.productID !== row.productID
          ) {
            currentProduct = {
              productID: row.productID,
              name: row.name,
              description: row.description,
              fProducts: [],
            };
            products.push(currentProduct);
          }

          if (row.fProductID) {
            currentProduct.fProducts.push({
              fProductID: row.fProductID,
              size: row.size,
              price: row.price,
            });
          }
        }

        res.json(products);
      }
    }
  );
});

// Route to handle updating a product
menuController.put("/product/update/:productID", (req, res) => {
  const productID = req.params.productID;
  const { name, description, size, price } = req.body;
  console.log({productID, name, description, size, price }); 

  // First, check if there are any changes to the values
  db.query(
    "SELECT * FROM Product WHERE productID = ?",
    [productID],
    (selectErr, selectResult) => {
      if (selectErr) {
        console.log(selectErr);
        res.status(500).send("Error checking product");
      } else if (selectResult.length === 0) {
        res.status(404).send("Product not found");
      } else {
        const product = selectResult[0];
       {
          // Update the product in the Product table
          db.query(
            "UPDATE Product SET name = ?, description = ? WHERE productID = ?",
            [name, description, productID],
            (err, productResult) => {
              if (err) {
                console.log(err);
                res.status(500).send("Error updating product");
              } else {
                if (size !== null && price !== null) {
                  // Update corresponding FProduct entry only if size and price are not null
                  db.query(
                    "UPDATE FProduct SET size = ?, price = ? WHERE productID = ?",
                    [size, price, productID],
                    (fErr, fProductResult) => {
                      if (fErr) {
                        console.log(fErr);
                        res.status(500).send("Error updating FProduct");
                      } else {
                        console.log("FProduct Result:", fProductResult);
                        res.send({
                          product:
                            productResult.affectedRows > 0
                              ? "Updated"
                              : "Not Found",
                          fProduct:
                            fProductResult.affectedRows > 0
                              ? "Updated"
                              : "Not Found",
                        });
                      }
                    }
                  );
                } else {
                  // If size or price is null, only update the Product entry
                  res.send({
                    product:
                      productResult.affectedRows > 0 ? "Updated" : "Not Found",
                    fProduct: "N/A",
                  });
                }
              }
            }
          );
        }
      }
    }
  );
});

menuController.delete("/product/delete/:productID", (req, res) => {
  const productID = req.params.productID;

  // Delete corresponding fProducts first
  db.query(
    "DELETE FROM FProduct WHERE productID = ?",
    productID,
    (fErr, fProductResult) => {
      if (fErr) {
        console.log(fErr);
        res.status(500).send("Error deleting fProducts");
        return;
      }

      // Delete the product from the Product table
      db.query(
        "DELETE FROM Product WHERE productID = ?",
        productID,
        (err, productResult) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error deleting product");
          } else {
            res.send({
              product: productResult.affectedRows > 0 ? "Deleted" : "Not Found",
              fProduct: fProductResult.affectedRows > 0 ? "Deleted" : "N/A",
            });
          }
        }
      );
    }
  );
});

module.exports = menuController;
