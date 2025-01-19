const sqlite3 = require("sqlite3").verbose();
const {
  testSQLiteConnection,
  testMySQLConnection,
  testPostgresConnection,
} = require("../utils/dbUtils");

// Test Database Connection
const testConnection = async (req, res) => {
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
};

const getSQLiteTablesAndShapes = (connectionUrl) => {
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
const { Client } = require("pg");

const getPostgresTablesAndShapes = async ({ host, port, username, password }) => {
  const client = new Client({
    host,
    port,
    user: username,
    password,
  });

  try {
    await client.connect();

    // Fetch all tables in the public schema
    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const tableShapes = {};

    // Process each table to fetch its columns
    for (const row of tablesResult.rows) {
      const tableName = row.table_name;

      const columnsResult = await client.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
      `,
        [tableName]
      );

      tableShapes[tableName] = columnsResult.rows.map((col) => ({
        name: col.column_name,
        type: col.data_type,
        notnull: col.is_nullable === "NO" ? 1 : 0,
        defaultValue: col.column_default,
      }));
    }

    return tableShapes;
  } catch (error) {
    throw new Error(`PostgreSQL error: ${error.message}`);
  } finally {
    await client.end();
  }
};

const getDatabaseSchema = async (req, res) => {
  const { dbType, connectionUrl } = req.body;
  if (dbType !== "sqlite" && dbType !== "postgres") {
    return res
      .status(400)
      .json({ error: "Currently, only SQLite is supported for schema retrieval." });
  }
  try {
    let schema;
    if (dbType === "sqlite") {
      schema = await getSQLiteTablesAndShapes(connectionUrl);
    } else if (dbType === "postgres") {
      const { host, port, username, password } = req.body;
      schema = await getPostgresTablesAndShapes({ host, port, username, password });
      console.log("schema", schema);
    }
    return res.status(200).json({ schema });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { testConnection, getDatabaseSchema };
