const { executeSQLiteQuery, executeMySQLQuery, executePostgresQuery } = require("../utils/dbUtils");

// Execute Query
const executeQuery = async (req, res) => {
  const { dbType, host, port, username, password, connectionUrl, query } = req.body;

  if ((!dbType && !connectionUrl) || (!host && !port && !username && !password)) {
    return res.status(400).json({ error: "Database config is required." });
  }
  if (!query) {
    return res.status(400).json({ error: "No query provided." });
  }

  try {
    const sanitizedQuery = query
      .split("\n")
      .filter((line) => !line.trim().startsWith("--"))
      .join(" ")
      .trim()
      .replace(/\s+/g, " ");

    const queries = sanitizedQuery.split(";").filter((q) => q.trim());
    console.log("queries", queries);
    if (queries.length > 1) {
      return res
        .status(400)
        .json({ error: "Multiple queries are not allowed. Please provide a single query." });
    }

    // Extract the single sanitized query
    const singleQuery = queries[0] + ";";

    let result;

    // Execute the query based on database type
    if (dbType === "sqlite") {
      result = await executeSQLiteQuery(connectionUrl, singleQuery);
    } else if (dbType === "mysql") {
      result = await executeMySQLQuery(host, port, username, password, singleQuery);
    } else if (dbType === "postgres") {
      result = await executePostgresQuery(host, port, username, password, singleQuery);
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
