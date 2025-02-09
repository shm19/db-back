class DbAdapterClass {
  constructor(connectionUrl) {
    if (new.target === DbAdapterClass) {
      throw new Error("Cannot instantiate DbAdapterClass directly.");
    }
    this.connectionUrl = connectionUrl;
  }

  async executeQuery(query) {
    throw new Error("executeQuery method must be implemented in the subclass.");
  }

  async getSchema() {
    throw new Error("getSchema method must be implemented in the subclass.");
  }

  async testConnection() {
    throw new Error("testConnection method must be implemented in the subclass.");
  }
}

module.exports = DbAdapterClass;
