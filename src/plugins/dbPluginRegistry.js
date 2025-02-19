const { validateAdapterStructure } = require("../utils/validateAdapterStructure");
const mysqlAdapter = require("../db-adapters/mysqlAdapter");
const postgresAdapter = require("../db-adapters/postgresAdapter");
const sqliteAdapter = require("../db-adapters/sqliteAdapter");
const mongodbAdapter = require("../db-adapters/mongodbAdapter");
const redisAdapter = require("../db-adapters/redisAdapter");

const adapters = {
  mysql: mysqlAdapter,
  postgres: postgresAdapter,
  sqlite: sqliteAdapter,
  mongodb: mongodbAdapter,
  redis: redisAdapter,
};

Object.keys(adapters).forEach((dbType) => {
  try {
    validateAdapterStructure(adapters[dbType]);
  } catch (e) {
    console.log(e);
  }
});

const getAdapterByName = (dbType) => {
  const adapter = adapters[dbType];
  if (!adapter) {
    throw new Error(`Adapter for database type '${dbType}' not found.`);
  }
  return adapter;
};

module.exports = { getAdapterByName };
