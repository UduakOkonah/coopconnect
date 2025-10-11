require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(helmet());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Dynamic Swagger setup (auto-detects environment)
app.use(
  '/api-docs',
  (req, res, next) => {
    // dynamically set server URL to match the environment (local or Render)
    specs.servers = [
      {
        url: `${req.protocol}://${req.get('host')}`,
      },
    ];
    next();
  },
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/cooperatives', require('./routes/cooperatives'));

// Health check route
app.get('/', (req, res) => res.json({ ok: true }));

// Error handler (must be last)
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
