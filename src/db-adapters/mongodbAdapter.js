const { MongoClient, ObjectId } = require("mongodb");

const DEFAULT_LIMIT = 10;

const executeMongoQuery = async ({ connectionUrl, query }) => {
  console.log("MongoDB executing query:", query);

  if (!query || !query.trim()) {
    throw new Error("Invalid query format. Provide a valid query string.");
  }

  const client = new MongoClient(connectionUrl);

  try {
    await client.connect();

    const normalizedQuery = query.replace(/\s+/g, " ").trim();

    const queryRegex = /^db\.([a-zA-Z0-9_]+)\.([a-zA-Z0-9_]+)\((.*)\)$/;
    const match = queryRegex.exec(normalizedQuery);

    if (!match) {
      throw new Error("Invalid query format. Use 'db.collection.method(...)'.");
    }

    const [, collectionName, method, paramString] = match;

    const db = client.db();
    const collection = db.collection(collectionName);

    let parsedParams;
    try {
      parsedParams = paramString
        ? eval(
            `[${paramString.replace(
              /ObjectId\((['"])(.*?)\1\)/g,
              (_, quote, id) => `new ObjectId('${id}')`
            )}]`
          )
        : [];
    } catch (error) {
      throw new Error(`Failed to parse query parameters: ${error.message}`);
    }

    let result;
    switch (method.toLowerCase()) {
      case "aggregate":
        if (!Array.isArray(parsedParams[0])) {
          throw new Error("Aggregate method requires a pipeline array as the first parameter.");
        }
        const pipeline = [...parsedParams[0]];
        if (!pipeline.some((stage) => stage.hasOwnProperty("$limit"))) {
          pipeline.push({ $limit: DEFAULT_LIMIT });
        }
        result = await collection.aggregate(pipeline).toArray();
        break;

      case "find":
        const filter = parsedParams[0] || {};
        const projection = parsedParams[1] || {};
        result = await collection.find(filter, { projection }).limit(DEFAULT_LIMIT).toArray();
        break;

      case "findone":
        const filterOne = parsedParams[0] || {};
        const projectionOne = parsedParams[1] || {};
        result = await collection.findOne(filterOne, { projection: projectionOne });
        break;

      case "insert":
        result = await collection.insertMany(parsedParams[0] || []);
        break;

      case "update":
        const updateFilter = parsedParams[0] || {};
        const updateDoc = parsedParams[1] || {};
        result = await collection.updateMany(updateFilter, updateDoc);
        break;

      case "delete":
        result = await collection.deleteMany(parsedParams[0] || {});
        break;

      default:
        throw new Error(`Unsupported method: ${method}`);
    }

    return result;
  } catch (error) {
    console.error("MongoDB query failed:", error.message);
    throw new Error(`MongoDB query failed: ${error.message}`);
  } finally {
    await client.close();
  }
};

const getMongoSchema = async ({ connectionUrl }) => {
  console.log("Fetching MongoDB schema...", connectionUrl);

  const client = new MongoClient(connectionUrl);
  try {
    await client.connect();
    const db = client.db();

    const collections = await db.listCollections().toArray();

    const schema = {};
    for (const collection of collections) {
      schema[collection.name] = [];
    }

    return schema;
  } catch (error) {
    console.error("Failed to fetch MongoDB schema:", error.message);
    throw new Error(`Failed to fetch MongoDB schema: ${error.message}`);
  } finally {
    await client.close();
  }
};

const testMongoConnection = async ({ connectionUrl }) => {
  console.log("Testing MongoDB connection...");

  const client = new MongoClient(connectionUrl);

  try {
    await client.connect();
    return "MongoDB connection test successful";
  } catch (error) {
    console.error("MongoDB connection test failed:", error.message);
    throw new Error(`MongoDB connection test failed: ${error.message}`);
  } finally {
    await client.close();
  }
};

module.exports = {
  name: "mongodb",
  executeQuery: executeMongoQuery,
  getSchema: getMongoSchema,
  testConnection: testMongoConnection,
};
