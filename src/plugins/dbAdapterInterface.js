class DatabaseAdapter {
  async executeQuery(params) {
    throw new Error("Method 'executeQuery' must be implemented.");
  }

  async getSchema(params) {
    throw new Error("Method 'getSchema' must be implemented.");
  }

  async testConnection(params) {
    throw new Error("Method 'testConnection' must be implemented.");
  }
}

module.exports = DatabaseAdapter;
