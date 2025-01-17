const express = require("express");
const db = require("./db"); // SQLite database instance

const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
const { Client } = require("pg");

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

const testSQLiteConnection = async (connectionUrl) => {
  console.log(connectionUrl);
  return new Promise((resolve, reject) => {
    if (!connectionUrl) {
      return reject(new Error("SQLite connection URL (file path) is required."));
    }
    const db = new sqlite3.Database(connectionUrl, (err) => {
      if (err) {
        return reject(new Error(`SQLite connection failed: ${err.message}`));
      }
      db.close();
      resolve("SQLite connection successful.");
    });
  });
};

const testMySQLConnection = async (host, port, username, password) => {
  if (!host || !username || !password || !port) {
    throw new Error("MySQL connection requires host, port, username, and password.");
  }
  const connection = await mysql.createConnection({
    host,
    port,
    user: username,
    password,
  });
  await connection.end();
  return "MySQL connection successful.";
};

const testPostgresConnection = async (host, port, username, password) => {
  if (!host || !username || !password || !port) {
    throw new Error("PostgreSQL connection requires host, port, username, and password.");
  }
  const client = new Client({
    host,
    port,
    user: username,
    password,
  });
  await client.connect();
  await client.end();
  return "PostgreSQL connection successful.";
};

router.post("/test-connection", async (req, res) => {
  const { dbType, host, port, username, password, connectionUrl } = req.body;
  console.log(req.body);
  try {
    let message;

    if (dbType === "sqlite") {
      message = await testSQLiteConnection(connectionUrl);
    } else if (dbType === "mysql") {
      message = await testMySQLConnection(host, port, username, password);
    } else if (dbType === "postgres") {
      message = await testPostgresConnection(host, port, username, password);
    } else {
      throw new Error("Unsupported database type.");
    }

    return res.status(200).json({ message });
  } catch (error) {
    console.error("Database connection test failed:", error.message);
    return res.status(400).json({ error: error.message });
  }
});

module.exports = router;
