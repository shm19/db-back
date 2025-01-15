const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const PORT = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Routes
app.use("/api", routes);

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
