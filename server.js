require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
require('./config/passport'); // 🧭 Google OAuth config
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const http = require('http');

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

// 🚀 Initialize Passport (Google OAuth)
app.use(passport.initialize());

// 📘 Dynamic Swagger Docs (auto-detect environment)
app.use(
  '/api-docs',
  (req, res, next) => {
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

// 🧍 Auth Routes (Google OAuth)
app.use('/auth', require('./routes/auth'));

// 🧍 User Routes
app.use('/api/users', require('./routes/users'));

// 💰 Contributions Routes
app.use('/api/contributions', require('./routes/contributions'));

// 🏢 Cooperative Routes
app.use('/api/cooperatives', require('./routes/cooperatives'));

// 📰 Posts Routes
app.use('/api/posts', require('./routes/posts'));

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

// ⚙️ Create HTTP server and increase timeout limits (for Render stability)
const PORT = process.env.PORT || 10000; // Render default port
const HOST = '0.0.0.0';

const server = http.createServer(app);
server.keepAliveTimeout = 120000; // 2 minutes
server.headersTimeout = 120000;

server.listen(PORT, HOST, () => {
  console.log(`✅ CoopConnect API running on http://${HOST}:${PORT}`);
});
