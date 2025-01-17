const express = require("express");
const cors = require("cors");
const dbRoutes = require("./routes/dbRoutes");
const queryRoutes = require("./routes/queryRoutes");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.use("/api", dbRoutes);
app.use("/api", queryRoutes);

// Server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
