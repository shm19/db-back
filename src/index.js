const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");

const dbRoutes = require("./routes/dbRoutes");
const queryRoutes = require("./routes/queryRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

// Routes
app.use("/api", dbRoutes);
app.use("/api", queryRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
