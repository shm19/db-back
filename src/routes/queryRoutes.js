const express = require("express");
const { executeQuery, getSchema } = require("../controllers/queryController");
const router = express.Router();

/**
 * Execute a database query
 */
router.post("/execute-query", executeQuery);
router.post("/get-schema", getSchema);

module.exports = router;
