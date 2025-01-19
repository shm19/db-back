const mysql = require("mysql2/promise");

const executeMySQLQuery = async ({ host, port, username, password, query }) => {
  console.log("MySQL executing query:", query);

  const connection = await mysql.createConnection({
    host,
    port,
    user: username,
    password,
  });

  try {
    const queryType = query.trim().split(" ")[0].toUpperCase();

    if (queryType === "SELECT") {
      const [rows] = await connection.query(query);
      return rows;
    } else if (queryType === "DELETE" || queryType === "UPDATE") {
      const [result] = await connection.query(query);
      return { changes: result.affectedRows };
    } else {
      await connection.query(query);
      return { message: "Query executed successfully." };
    }
  } catch (error) {
    console.error(`MySQL query failed: ${error.message}`);
    throw new Error(`MySQL query failed: ${error.message}`);
  } finally {
    await connection.end();
  }
};

const getMySQLSchema = async ({ host, port, username, password }) => {
  console.log("Fetching MySQL schema...");

  const connection = await mysql.createConnection({
    host,
    port,
    user: username,
    password,
  });

  try {
    const [tables] = await connection.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
    `);

    const tableShapes = {};

    for (const table of tables) {
      const tableName = table.TABLE_NAME;

      const [columns] = await connection.query(
        `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = ?
      `,
        [tableName]
      );

      tableShapes[tableName] = columns.map((col) => ({
        name: col.COLUMN_NAME,
        type: col.DATA_TYPE,
        notnull: col.IS_NULLABLE === "NO",
        defaultValue: col.COLUMN_DEFAULT,
      }));
    }

    return tableShapes;
  } catch (error) {
    console.error(`Failed to fetch MySQL schema: ${error.message}`);
    throw new Error(`Failed to fetch MySQL schema: ${error.message}`);
  } finally {
    await connection.end();
  }
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

module.exports = {
  name: "mysql",
  executeQuery: executeMySQLQuery,
  getSchema: getMySQLSchema,
  testConnection: testMySQLConnection,
};
