const express = require("express");
const { getSchema, executeQuery, testConnection } = require("../controllers/dbController");

const router = express.Router();

router.post("/test-connection", testConnection);

module.exports = router;
