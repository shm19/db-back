const express = require("express");
const { executeQuery } = require("../controllers/queryController");

const router = express.Router();

// Execute query
router.post("/execute-query", executeQuery);

module.exports = router;
