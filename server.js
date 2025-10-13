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

// 🧩 Middleware
app.use(helmet());

// ✅ CORS setup (explicitly allow Swagger & client)
app.use(
  cors({
    origin: '*', // Allow all origins for development/testing
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());

// 🧾 HTTP request logging (only in dev)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// 📘 Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// 🧍 User Routes
app.use('/api/users', require('./routes/users'));

// 🏢 Cooperative Routes
app.use('/api/cooperatives', require('./routes/cooperatives'));

// 🌍 Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the CoopConnect API 🚀',
    docs: `${process.env.BASE_URL || 'http://localhost:5000'}/api-docs`,
  });
});

// ⚠️ Handle undefined routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// 🧱 Global Error Handler (last)
app.use(errorHandler);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ CoopConnect API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
