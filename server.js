require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const { swaggerUi, specs } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/db');

const app = express();

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

// Session & Passport (for Google OAuth)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

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
app.use('/api/users', require('./routes/users'));
app.use('/api/cooperatives', require('./routes/cooperatives'));
app.use('/api/posts', require('./routes/posts'));
app.use('/api/contributions', require('./routes/contributions'));

// Health check route
app.get('/', (req, res) => res.json({ ok: true }));

// Error handler (must be last)
app.use(errorHandler);

// Wait for MongoDB connection before starting the server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB(); // Wait for DB to connect first
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

startServer();
