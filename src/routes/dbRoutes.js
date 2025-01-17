const express = require("express");
const { testConnection } = require("../controllers/dbController");

const router = express.Router();

// Test database connection
router.post("/test-connection", testConnection);

module.exports = router;
