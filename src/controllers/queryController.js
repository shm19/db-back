const { getAdapterByName } = require("../plugins/dbPluginRegistry");

/**
 * Execute a database query
 */
const executeQuery = async (req, res) => {
  const { dbType, query, ...connectionDetails } = req.body;

  if (!query) {
    return res.status(400).json({ error: "No query provided." });
  }

  try {
    const adapter = getAdapterByName(dbType);
    const result = await adapter.executeQuery({ ...connectionDetails, query });
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error("Query execution failed:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

/**
 * Get database schema
 */
const getSchema = async (req, res) => {
  const { dbType, ...connectionDetails } = req.body;

  try {
    const adapter = getAdapterByName(dbType);
    const schema = await adapter.getSchema(connectionDetails);
    return res.status(200).json({ schema });
  } catch (error) {
    console.error("Failed to fetch schema:", error.message);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = { executeQuery, getSchema };
