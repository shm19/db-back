module.exports.validateAdapterStructure = (adapter) => {
  if (typeof adapter.executeQuery !== "function") {
    throw new Error("Adapter must implement 'executeQuery' method.");
  }
  if (typeof adapter.getSchema !== "function") {
    throw new Error("Adapter must implement 'getSchema' method.");
  }
  if (typeof adapter.testConnection !== "function") {
    throw new Error("Adapter must implement 'testConnection' method.");
  }
  if (typeof adapter.isSql !== "function") {
    throw new Error("Adapter must implement 'isSql' method.");
  }
};
