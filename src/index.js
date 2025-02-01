const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const { corsOptions } = require("./utils/corsOptions");

require("dotenv").config();

const dbRoutes = require("./routes/dbRoutes");
const queryRoutes = require("./routes/queryRoutes");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(helmet());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(morgan("dev"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

app.use("/api", dbRoutes, queryRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
