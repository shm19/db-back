const express = require("express");
const { testConnection, getDatabaseSchema } = require("../controllers/dbController");

const router = express.Router();

// Test database connection
router.post("/test-connection", testConnection);
router.post("/get-schema", getDatabaseSchema);
module.exports = router;
