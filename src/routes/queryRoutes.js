const express = require("express");
const { executeQuery } = require("../controllers/queryController");

const router = express.Router();

// Execute SQL Query
router.post("/execute-query", executeQuery);

module.exports = router;
