const sqlite3 = require("sqlite3").verbose();

const executeSQLiteQuery = ({ connectionUrl, query }) => {
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
        resolve(rows);
      });
    } else if (queryType === "DELETE" || queryType === "UPDATE") {
      db.run(query, function (err) {
        if (err) {
          db.close();
          return reject(new Error(`SQLite ${queryType} query failed: ${err.message}`));
        }
        db.close();
        resolve({ changes: this.changes });
      });
    } else {
      db.run(query, function (err) {
        if (err) {
          db.close();
          return reject(new Error(`SQLite query failed: ${err.message}`));
        }
        db.close();
        resolve({ message: "Query executed successfully." });
      });
    }
  });
};

const getSQLiteSchema = ({ connectionUrl }) => {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(connectionUrl, (err) => {
      if (err) {
        return reject(new Error(`SQLite connection failed: ${err.message}`));
      }
    });

    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
      if (err) {
        db.close();
        return reject(new Error(`Failed to fetch tables: ${err.message}`));
      }

      const tableShapes = {};

      const processTable = (tableIndex) => {
        if (tableIndex >= tables.length) {
          db.close();
          return resolve(tableShapes); // Resolve once all tables are processed
        }

        const tableName = tables[tableIndex].name;

        db.all(`PRAGMA table_info(${tableName})`, [], (err, columns) => {
          if (err) {
            db.close();
            return reject(
              new Error(`Failed to fetch table shape for ${tableName}: ${err.message}`)
            );
          }

          tableShapes[tableName] = columns.map((col) => ({
            name: col.name,
            type: col.type,
            notnull: col.notnull,
            defaultValue: col.dflt_value,
          }));

          processTable(tableIndex + 1); // Process the next table
        });
      };

      processTable(0); // Start processing the tables
    });
  });
};

const testSQLiteConnection = ({ connectionUrl }) => {
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

module.exports = {
  name: "sqlite",
  executeQuery: executeSQLiteQuery,
  getSchema: getSQLiteSchema,
  testConnection: testSQLiteConnection,
};
