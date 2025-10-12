require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
const bcrypt = require('bcryptjs');
(async () => {
  const hash = await bcrypt.hash('123456', 10);
  const match = await bcrypt.compare('123456', hash);
  console.log({ hash, match });
})();


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

// Dynamic Swagger setup
app.use(
  '/api-docs',
  (req, res, next) => {
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
app.use('/api/users', require('./routes/users')); // user registration, login, CRUD
app.use('/api/cooperatives', require('./routes/cooperatives')); // cooperatives CRUD
app.use('/api/posts', require('./routes/posts')); // posts CRUD with role-based access
app.use('/api/contributions', require('./routes/contributions')); // contributions CRUD with role-based access

// Health check route
app.get('/', (req, res) => res.json({ ok: true }));

// Error handler (must be last)
app.use(errorHandler);

// Server start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
