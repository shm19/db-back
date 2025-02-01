module.exports.corsOptions = {
  origin: (origin, callback) => {
    if (process.env.NODE_ENV === "development") {
      if (origin === "http://localhost:3000" || origin === undefined) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    } else {
      if (origin === "https://your-frontend-domain.com") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
