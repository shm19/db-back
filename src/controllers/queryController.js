const { executeSQLiteQuery, executeMySQLQuery, executePostgresQuery } = require("../utils/dbUtils");

// Execute Query
const executeQuery = async (req, res) => {
  const { dbType, host, port, username, password, connectionUrl, query } = req.body;
  console.log(req.body);
  if (!query) {
    return res.status(400).json({ error: "No query provided." });
  }

  try {
    let result;

    if (dbType === "sqlite") {
      result = await executeSQLiteQuery(connectionUrl, query);
    } else if (dbType === "mysql") {
      result = await executeMySQLQuery(host, port, username, password, query);
    } else if (dbType === "postgres") {
      result = await executePostgresQuery(host, port, username, password, query);
    } else {
      throw new Error("Unsupported database type.");
    }

    console.log(result);
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error("Query execution failed:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { executeQuery };
