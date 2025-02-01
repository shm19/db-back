# Backend Documentation

This is the backend component of the **Notebook App**, which provides API endpoints for managing notebooks, executing database queries, and retrieving database schemas. It supports multiple database types, including SQL and NoSQL databases, through a plugin-based adapter system.

---

## Features

- **Multi-Database Support**: Integrates with MySQL, PostgreSQL, SQLite, MongoDB, and Redis.
- **Dynamic Query Execution**: Executes SQL and NoSQL queries with customizable adapters.
- **Schema Retrieval**: Fetches database schemas for SQL and NoSQL databases.
- **Adapter-Based Architecture**: Easily extendable to support additional databases.
- **REST API**: Provides endpoints for query execution, schema retrieval, and notebook operations.

---

## Project Structure

```plaintext
.
├── controllers
│   ├── dbController.js       # Manages database operations
│   └── queryController.js    # Handles query execution and schema retrieval
├── db-adapters
│   ├── mysqlAdapter.js       # Adapter for MySQL
│   ├── postgresAdapter.js    # Adapter for PostgreSQL
│   ├── sqliteAdapter.js      # Adapter for SQLite
│   ├── mongodbAdapter.js     # Adapter for MongoDB
│   └── redisAdapter.js       # Adapter for Redis
├── index.js                  # Entry point for the server
├── plugins
│   └── dbPluginRegistry.js   # Registry for database adapters
├── routes
│   ├── dbRoutes.js           # Routes for database-related operations
│   └── queryRoutes.js        # Routes for query execution and schema retrieval
└── utils
    └── dbUtils.js            # Helper functions for database operations
```

---

## Setup Instructions

### Prerequisites

- **Node.js**: Ensure you have Node.js (>=14.x) installed.
- **Databases**: Ensure your desired databases (MySQL, PostgreSQL, MongoDB, Redis, etc.) are running and accessible.

## Installation

### Local Development

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file to configure environment variables (e.g., port, database credentials).

   Example:

   ```env
   PORT=8000
   ```

4. Start the server:

   ```bash
   npm start
   ```

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t backend-service .
   ```
2. Run the container:
   ```bash
   docker run -p 8000:8000 --env-file .env backend-service
   ```

### Using Docker Compose

1. Ensure you have the `docker-compose.yml` file in the parent directory.
2. Start the services:
   ```bash
   docker-compose up
   ```
3. The backend will be available at `http://localhost:8000`.

---

## API Endpoints

### Base URL

```
http://localhost:<PORT>/api
```

### Routes

#### Query Execution

- **POST** `/execute-query`
  Executes a query on the specified database.

  **Request Body**:

  ```json
  {
    "dbType": "mysql",
    "query": "SELECT * FROM users;",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "password"
  }
  ```

  **Response**:

  ```json
  {
    "data": [{ "id": 1, "name": "John Doe", "email": "john@example.com" }]
  }
  ```

#### Schema Retrieval

- **POST** `/get-schema`
  Fetches the schema (e.g., tables or collections) of a database.

  **Request Body**:

  ```json
  {
    "dbType": "mongodb",
    "host": "localhost",
    "port": 27017,
    "username": "admin",
    "password": "password"
  }
  ```

  **Response**:

  ```json
  {
    "schema": {
      "users": [],
      "orders": []
    }
  }
  ```

---

## Extending the Project

### Adding a New Database Adapter

1. Create a new adapter file in the `db-adapters` directory (e.g., `oracleAdapter.js`).
2. Implement the required methods:
   - `executeQuery()`
   - `getSchema()`
   - `testConnection()`
3. Register the adapter in `dbPluginRegistry.js`.

Example Adapter Template:

```javascript
module.exports = {
  name: "oracle",
  executeQuery: async ({ query, ...connectionDetails }) => {
    /* logic */
  },
  getSchema: async (connectionDetails) => {
    /* logic */
  },
  testConnection: async (connectionDetails) => {
    /* logic */
  },
};
```

### Modifying the Response Structure

Use middleware or centralized helpers in `controllers/dbController.js` or `utils/dbUtils.js` to ensure a consistent response structure across APIs.

---

## Testing

- Run unit tests:

  ```bash
  npm test
  ```

- Test APIs with tools like **Postman** or **cURL**.

---

## Contributing

1. Fork the repository.
2. Create a new branch for your feature/bugfix.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.
