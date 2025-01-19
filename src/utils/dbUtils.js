const sqlite3 = require("sqlite3").verbose();
const mysql = require("mysql2/promise");
const { Client } = require("pg");

const executeSQLiteQuery = (connectionUrl, query) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(connectionUrl, (err) => {
      if (err) {
        return reject(new Error(`SQLite connection failed: ${err.message}`));
      }
    });

    console.log("SQLite executing query:", query);

    const queryType = query.trim().split(" ")[0].toUpperCase();

    if (queryType === "SELECT") {
      db.all(query, [], (err, rows) => {
        if (err) {
          db.close();
          return reject(new Error(`SQLite SELECT query failed: ${err.message}`));
        }
        db.close();
        resolve(rows); // Return rows for SELECT
      });
    } else if (queryType === "DELETE" || queryType === "UPDATE") {
      db.run(query, function (err) {
        if (err) {
          db.close();
          return reject(new Error(`SQLite ${queryType} query failed: ${err.message}`));
        }
        db.close();
        resolve({ changes: this.changes }); // Return number of affected rows
      });
    } else {
      db.run(query, function (err) {
        if (err) {
          db.close();
          return reject(new Error(`SQLite query failed: ${err.message}`));
        }
        db.close();
        resolve({ message: "Query executed successfully." }); // Return success for other queries
      });
    }
  });
};

/**
 * Execute MySQL Query
 */
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

const executePostgresQuery = async (host, port, username, password, query) => {
  const client = new Client({
    host,
    port,
    user: username,
    password,
  });

  try {
    console.log("PostgreSQL executing query:", query);
    await client.connect();

    const queryType = query.trim().split(" ")[0].toUpperCase();

    if (queryType === "SELECT" || queryType === "WITH") {
      const result = await client.query(query);
      return result.rows; // Return rows for SELECT
    } else if (queryType === "DELETE" || queryType === "UPDATE") {
      const result = await client.query(query);
      return { changes: result.rowCount }; // Return number of affected rows
    } else {
      await client.query(query);
      return { message: "Query executed successfully." };
    }
  } catch (error) {
    console.error(`PostgreSQL query failed: ${error.message}`);
    throw new Error(`PostgreSQL query failed: ${error.message}`);
  } finally {
    await client.end();
  }
};
