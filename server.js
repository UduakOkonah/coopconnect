require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 🧱 Connect to MongoDB
connectDB();

// 🧩 Security Middleware
app.use(helmet());

// ✅ Enhanced CORS setup (Swagger + Render + local)
app.use(
  cors({
    origin: '*', // Allow all origins for development and Render
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// 🧾 HTTP Request Logging (only in dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 📘 Dynamic Swagger Docs (auto-detect environment)
app.use(
  '/api-docs',
  (req, res, next) => {
    // Dynamically set the API base URL depending on host and protocol
    specs.servers = [
      {
        url: `${req.protocol}://${req.get('host')}`,
        description: 'Dynamic server (auto-detected)',
      },
    ];
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

// 🧍 User Routes
app.use('/api/users', require('./routes/users'));

// 🏢 Cooperative Routes
app.use('/api/cooperatives', require('./routes/cooperatives'));

// 🌍 Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the CoopConnect API 🚀',
    docs: `${process.env.BASE_URL || `${req.protocol}://${req.get('host')}`}/api-docs`,
  });
});

// ⚠️ Handle Undefined Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// 🧱 Global Error Handler (must be last)
app.use(errorHandler);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `✅ CoopConnect API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
  );
});
