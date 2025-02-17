const express = require("express");
const { testConnection, isSql } = require("../controllers/dbController");

const router = express.Router();

router.post("/test-connection", testConnection);
router.post("/is-sql", isSql);

module.exports = router;
