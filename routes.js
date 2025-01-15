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
  // Validate that a query is provided
  if (!query) {
    return res.status(400).json({ error: "No query provided" });
  }

  // Execute the SQL query using db.all (to handle SELECT statements)
  db.all(query, [], (err, rows) => {
    if (err) {
      console.log(rows);
      // Return an error response if the query fails
      console.error("Error running query:", err.message);
      return res.status(400).json({ error: `SQL Error: ${err.message}` });
    }

    // Return the rows (results) as JSON
    console.log(rows);
    res.json({ data: rows });
  });
});

module.exports = router;
