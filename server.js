require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// 🔗 Connect to MongoDB
connectDB();

// 🔐 Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// 🧩 API Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/users', require('./routes/users'));
app.use('/api/cooperatives', require('./routes/cooperatives'));

// 🌍 Health Check Endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the CoopConnect API 🚀',
    docs: '/api-docs',
  });
});

// 🧱 404 Middleware for Unknown Routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ⚠️ Global Error Handler (must be last)
app.use(errorHandler);

// 🚀 Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ CoopConnect API running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
