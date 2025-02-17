const Redis = require("ioredis");

const executeRedisQuery = async ({ connectionUrl, query }) => {
  console.log("Redis executing query:", query);

  if (!query || !query.trim()) {
    throw new Error("Invalid query format. Provide a valid Redis command.");
  }

  const redis = new Redis(connectionUrl);

  try {
    const [command, ...args] = query.trim().split(/\s+/);
    const normalizedCommand = command.toLowerCase();

    if (typeof redis[normalizedCommand] !== "function") {
      throw new Error(`Unsupported Redis command: ${command}`);
    }

    let result = await redis[normalizedCommand](...args);
    if (!result || result.length === 0 || Object.keys(result).length === 0) {
      return "No result";
    }
    console.log("Redis result:", result);
    if (Array.isArray(result)) {
      result = result.map((item) => (typeof item === "string" ? item.replace(/"/g, "") : item));
    }
    if (typeof result === "object") {
      result = Object.fromEntries(
        Object.entries(result).map(([key, value]) => [
          key.replace(/"/g, ""),
          value.replace(/"/g, ""),
        ])
      );
    }

    return result;
  } catch (error) {
    console.error("Redis query failed:", error.message);
    throw new Error(`Redis query failed: ${error.message}`);
  } finally {
    await redis.quit();
  }
};

const getRedisSchema = async ({ connectionUrl }) => {
  console.log("Fetching Redis schema...", connectionUrl);

  const redis = new Redis(connectionUrl);

  try {
    const keys = await redis.keys("*");
    const schema = {};

    for (const key of keys) {
      const type = await redis.type(key);
      schema[key] = type;
    }

    return schema;
  } catch (error) {
    console.error("Failed to fetch Redis schema:", error.message);
    throw new Error(`Failed to fetch Redis schema: ${error.message}`);
  } finally {
    await redis.quit();
  }
};

/**
 * Test Redis connection
 */
const testRedisConnection = async ({ connectionUrl }) => {
  console.log("Testing Redis connection...");

  const redis = new Redis(connectionUrl);

  try {
    await redis.ping();
    return "Redis connection test successful";
  } catch (error) {
    console.error("Redis connection test failed:", error.message);
    throw new Error(`Redis connection test failed: ${error.message}`);
  } finally {
    await redis.quit();
  }
};

module.exports = {
  name: "redis",
  executeQuery: executeRedisQuery,
  getSchema: getRedisSchema,
  testConnection: testRedisConnection,
  isSql: () => false,
};
