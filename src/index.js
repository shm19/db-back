const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dbRoutes = require("./routes/dbRoutes");
const queryRoutes = require("./routes/queryRoutes");

const app = express();
const PORT = 8000;

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// API Routes
app.use("/api", dbRoutes, queryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
