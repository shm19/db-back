const express = require("express");
const db = require("./db"); // SQLite database instance

const router = express.Router();

/**
 * POST /api/query
 * Executes the SQL query sent in the request body.
 */
router.post("/query", (req, res) => {
  const { query } = req.body;
  console.log(query);
  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  // Determine the type of query
  const queryType = query.trim().split(" ")[0].toUpperCase();
  switch (queryType) {
    case "SELECT":
      // Handle SELECT queries
      db.all(query, [], (err, rows) => {
        if (err) {
          console.error("Error running SELECT query:", err.message);
          return res.status(400).json({ error: `SQL Error: ${err.message}` });
        }
        res.json({ data: rows });
      });
      break;

    case "INSERT":
      // Handle INSERT queries
      db.run(query, function (err) {
        if (err) {
          console.error("Error running INSERT query:", err.message);
          return res.status(400).json({ error: `SQL Error: ${err.message}` });
        }
        res.json({ message: "Row inserted successfully", id: this.lastID });
      });
      break;

    case "UPDATE":
      // Handle UPDATE queries
      db.run(query, function (err) {
        if (err) {
          console.error("Error running UPDATE query:", err.message);
          return res.status(400).json({ error: `SQL Error: ${err.message}` });
        }
        res.json({ message: "Row(s) updated successfully", changes: this.changes });
      });
      break;

    case "DELETE":
      // Handle DELETE queries
      db.run(query, function (err) {
        if (err) {
          console.error("Error running DELETE query:", err.message);
          return res.status(400).json({ error: `SQL Error: ${err.message}` });
        }
        res.json({ message: "Row(s) deleted successfully", changes: this.changes });
      });
      break;

    default:
      console.log(query);
      // Handle unsupported query types
      res.status(400).json({ error: "Unsupported query type" });
  }
});

module.exports = router;
