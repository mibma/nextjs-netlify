const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Error connecting to database", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create a table if it does not exist
db.run(
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
  )`,
  (err) => {
    if (err) console.error("Error creating table:", err.message);
  }
);

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to the Node.js SQLite backend!");
});

// Create a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  db.run("INSERT INTO users (name, email) VALUES (?, ?)", [name, email], function (err) {
    if (err) {
      res.status(400).json({ error: err.message });
    } else {
      res.json({ id: this.lastID, name, email });
    }
  });
});

// Get all users
app.get("/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
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
