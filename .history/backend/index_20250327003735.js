const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./inventory.db", (err) => {
  if (err) {
    console.error("Error connecting to database", err.message);
  } else {
    console.log("Connected to SQLite database");
    initializeDatabase();
  }
});

// Initialize database with our schema
function initializeDatabase() {
  db.serialize(() => {
    // Create Products table
    db.run(`CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      barcode TEXT UNIQUE,
      category TEXT,
      unit_price REAL NOT NULL CHECK(unit_price >= 0),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Create Inventory table
    db.run(`CREATE TABLE IF NOT EXISTS inventory (
      inventory_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      current_quantity INTEGER NOT NULL DEFAULT 0 CHECK(current_quantity >= 0),
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
    )`);

    // Create Stock Movements table
    db.run(`CREATE TABLE IF NOT EXISTS stock_movements (
      movement_id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      quantity_change INTEGER NOT NULL,
      movement_type TEXT NOT NULL CHECK(movement_type IN ('STOCK_IN', 'SALE', 'MANUAL_REMOVAL', 'ADJUSTMENT')),
      reference_id TEXT,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    )`);
  });
}

// PRODUCTS ENDPOINTS
// Create a new product
app.post("/products", (req, res) => {
  const { name, description, barcode, category, unit_price } = req.body;
  console.log(req.body);
  db.run(
    "INSERT INTO products (name, description, barcode, category, unit_price) VALUES (?, ?, ?, ?, ?)",
    [name, description, barcode, category, unit_price],
    function(err) {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      
      // Initialize inventory for this product
      db.run(
        "INSERT INTO inventory (product_id, current_quantity) VALUES (?, 0)",
        [this.lastID],
        function(invErr) {
          if (invErr) {
            return res.status(500).json({ error: "Failed to initialize inventory" });
          }
          res.json({ 
            product_id: this.lastID, 
            name, 
            barcode,
            message: "Product and inventory created successfully"
          });
        }
      );
    }
  );
});

// Get all products with current inventory
app.get("/products", (req, res) => {
  db.all(`
    SELECT p.*, i.current_quantity 
    FROM products p
    LEFT JOIN inventory i ON p.product_id = i.product_id
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// INVENTORY ENDPOINTS
// Record stock movement
app.post("/inventory/movement", (req, res) => {
    const { product_id, quantity_change, movement_type, reference_id, notes } = req.body;
  
    console.log("Received Data:", req.body);
  
    // Validate movement type
    const validTypes = ['STOCK_IN', 'SALE', 'MANUAL_REMOVAL', 'ADJUSTMENT'];
    if (!validTypes.includes(movement_type)) {
      return res.status(400).json({ error: "Invalid movement type" });
    }
  
    db.serialize(() => {
      db.run("BEGIN TRANSACTION");
  
      // Insert stock movement
      db.run(
        "INSERT INTO stock_movements (product_id, quantity_change, movement_type, reference_id, notes) VALUES (?, ?, ?, ?, ?)",
        [product_id, quantity_change, movement_type, reference_id || null, notes || null],  // Fix for undefined values
        function (err) {
          if (err) {
            console.error("Insert Error:", err.message);
            db.run("ROLLBACK");
            return res.status(400).json({ error: err.message });
          }
  
          console.log("Stock Movement Inserted. ID:", this.lastID);
  
          // Update inventory
          let updateQuery;
          let updateValues;
  
          if (movement_type === 'SALE' || movement_type === 'MANUAL_REMOVAL') {
            updateQuery = `
              UPDATE inventory 
              SET current_quantity = current_quantity - ?, 
                  last_updated = CURRENT_TIMESTAMP
              WHERE product_id = ? AND (current_quantity - ?) >= 0
            `;
            updateValues = [Math.abs(quantity_change), product_id, Math.abs(quantity_change)];
          } else {
            updateQuery = `
              UPDATE inventory 
              SET current_quantity = current_quantity + ?, 
                  last_updated = CURRENT_TIMESTAMP
              WHERE product_id = ?
            `;
            updateValues = [Math.abs(quantity_change), product_id];
          }
  
          console.log("Executing SQL:", updateQuery, updateValues);
  
          db.run(updateQuery, updateValues, function (updateErr) {
            if (updateErr || this.changes === 0) {
              console.error("Update Error:", updateErr ? updateErr.message : "No rows updated");
              db.run("ROLLBACK");
              return res.status(400).json({ 
                error: updateErr ? updateErr.message : "Insufficient stock or invalid product" 
              });
            }
  
            db.run("COMMIT");
            res.json({ 
              message: "Inventory updated successfully",
              movement_id: this.lastID
            });
          });
        }
      );
    });
  });
  
// Get current inventory
app.get("/inventory", (req, res) => {
  db.all(`
    SELECT p.product_id, p.name, p.barcode, i.current_quantity, i.last_updated
    FROM inventory i
    JOIN products p ON i.product_id = p.product_id
  `, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Get movement history for a product
app.get("/inventory/history/:product_id", (req, res) => {
  const { product_id } = req.params;
  
  db.all(`
    SELECT * FROM stock_movements
    WHERE product_id = ?
    ORDER BY created_at DESC
  `, [product_id], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});