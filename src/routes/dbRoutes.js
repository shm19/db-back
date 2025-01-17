const express = require("express");
const { testConnection } = require("../controllers/dbController");

const router = express.Router();

// Test Database Connection
router.post("/test-connection", testConnection);

module.exports = router;
