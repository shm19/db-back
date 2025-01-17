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

module.exports = { testConnection };
