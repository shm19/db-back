const { getAdapterByName } = require("../plugins/dbPluginRegistry");

const testConnection = async (req, res) => {
  const { dbType, ...connectionDetails } = req.body;
  console.log("test database connection", dbType, connectionDetails);

  if (!dbType) {
    return res.status(400).json({ error: "Database type is required" });
  }
  if (
    !connectionDetails.connectionUrl &&
    !(connectionDetails.host && connectionDetails.password && connectionDetails.username)
  ) {
    return res.status(400).json({ error: "Connection details are required" });
  }

  try {
    const adapter = getAdapterByName(dbType);
    const message = await adapter.testConnection(connectionDetails);
    return res.status(200).json({ message });
  } catch (error) {
    console.error("Connection test failed:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

const isSql = async (req, res) => {
  const { dbType } = req.body;

  if (!dbType) {
    return res.status(400).json({ error: "Database type is required" });
  }

  try {
    const adapter = getAdapterByName(dbType);
    const isSql = await adapter.isSql();
    console.log(isSql);
    return res.status(200).json({ isSql });
  } catch (error) {
    console.error("Connection test failed:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { testConnection, isSql };
