const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
const { Client } = require("pg");

// Test SQLite Connection
const testSQLiteConnection = (connectionUrl) => {
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

// Test MySQL Connection
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

// Test PostgreSQL Connection
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

// Execute SQLite Query
const executeSQLiteQuery = (connectionUrl, query) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(connectionUrl, (err) => {
      if (err) {
        return reject(new Error(`SQLite connection failed: ${err.message}`));
      }
    });

    db.all(query, [], (err, rows) => {
      if (err) {
        db.close();
        return reject(new Error(`SQLite query failed: ${err.message}`));
      }
      db.close();
      resolve(rows);
    });
  });
};

// Execute MySQL Query
const executeMySQLQuery = async (host, port, username, password, query) => {
  const connection = await mysql.createConnection({
    host,
    port,
    user: username,
    password,
  });
  const [rows] = await connection.query(query);
  await connection.end();
  return rows;
};

// Execute PostgreSQL Query
const executePostgresQuery = async (host, port, username, password, query) => {
  const client = new Client({
    host,
    port,
    user: username,
    password,
  });
  await client.connect();
  const result = await client.query(query);
  await client.end();
  return result.rows;
};

module.exports = {
  testSQLiteConnection,
  testMySQLConnection,
  testPostgresConnection,
  executeSQLiteQuery,
  executeMySQLQuery,
  executePostgresQuery,
};
