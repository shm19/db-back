const { Client } = require("pg");

/**
 * Execute a PostgreSQL query
 */
const executePostgresQuery = async ({ host, port, username, password, query }) => {
  console.log("PostgreSQL executing query:", host, port, username, password, query);
  const client = new Client({
    host,
    port,
    user: username,
    password,
  });

  try {
    await client.connect();
    const queryType = query.trim().split(" ")[0].toUpperCase();
    if (queryType === "SELECT" || queryType === "WITH") {
      const result = await client.query(query);
      console.log("PostgreSQL result:", result.rows);
      return result.rows;
    } else if (queryType === "DELETE" || queryType === "UPDATE") {
      const result = await client.query(query);
      return { changes: result.rowCount };
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

/**
 * Get PostgreSQL schema (tables and their shapes)
 */
const getPostgresSchema = async ({ host, port, username, password }) => {
  console.log("Fetching PostgreSQL schema...", host, port, username, password);

  const client = new Client({
    host,
    port,
    user: username,
    password,
  });

  try {
    await client.connect();

    const tablesResult = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);

    const tableShapes = {};

    for (const table of tablesResult.rows) {
      const tableName = table.table_name;

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
        notnull: col.is_nullable === "NO",
        defaultValue: col.column_default,
      }));
    }

    return tableShapes;
  } catch (error) {
    console.error(`Failed to fetch PostgreSQL schema: ${error.message}`);
    throw new Error(`Failed to fetch PostgreSQL schema: ${error.message}`);
  } finally {
    await client.end();
  }
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

module.exports = {
  name: "postgres",
  executeQuery: executePostgresQuery,
  getSchema: getPostgresSchema,
  testConnection: testPostgresConnection,
};
