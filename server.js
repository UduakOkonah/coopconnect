require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const passport = require("passport");
const http = require("http");

// 🧭 Google OAuth config
require("./config/passport");

// 🧱 MongoDB connection
const connectDB = require("./config/db");

// 🧾 Swagger setup
const { swaggerUi, specs } = require("./config/swagger");

// ⚠️ Error handler middleware
const errorHandler = require("./middleware/errorHandler");

const app = express();

// ✅ Connect to MongoDB
connectDB();

// 🧩 Security Middleware
app.use(helmet());

// ✅ CORS setup (for Swagger + Render + Localhost)
app.use(
  cors({
    origin: "*", // Allow all for dev/Render
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🧾 Logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// 🚀 Initialize Passport (for Google OAuth)
app.use(passport.initialize());

// ✅ Parse JSON bodies
app.use(express.json());

// 📘 Swagger Docs (Dynamic server detection)
app.use(
  "/api-docs",
  (req, res, next) => {
    // Dynamically set Swagger "servers" based on current request
    specs.servers = [
      {
        url: `${req.protocol}://${req.get("host")}`,
        description: "Auto-detected server",
      },
    ];
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// 🧍 API Routes
app.use("/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/contributions", require("./routes/contributions"));
app.use("/api/cooperatives", require("./routes/cooperatives"));
app.use("/api/posts", require("./routes/posts"));

// 🌍 Health Check Route
app.get("/", (req, res) => {
  const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
  res.status(200).json({
    success: true,
    message: "Welcome to the CoopConnect API 🚀",
    docs: `${baseUrl}/api-docs`,
  });
});

// ⚠️ Catch-All for Undefined Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// 🧱 Global Error Handler
app.use(errorHandler);

// 🧪 Export app for testing (Jest + Supertest)
module.exports = app;

// 🚀 Start server (only if NOT in test mode)
if (process.env.NODE_ENV !== "test") {
  const PORT = process.env.PORT || 10000;
  const HOST = "0.0.0.0";

  const server = http.createServer(app);

  // Prevent timeout issues on cloud hosts like Render/Azure
  server.keepAliveTimeout = 120000;
  server.headersTimeout = 120000;

  server.listen(PORT, HOST, () => {
    console.log(`✅ CoopConnect API running on http://${HOST}:${PORT}`);
  });
}
