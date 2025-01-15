const sqlite3 = require("sqlite3").verbose();

// Initialize SQLite Database
const db = new sqlite3.Database("./database.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Create a sample table
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS sample_data (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL
    )`
  );
  db.run(`INSERT INTO sample_data (name, age) VALUES ('John Doe', 25), ('Jane Smith', 30)`);
});

module.exports = db;
