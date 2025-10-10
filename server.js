require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const passport = require('passport');
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

// Initialize app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Initialize Passport (for Google OAuth)
app.use(passport.initialize());
require('./config/passport')(passport); // 🔥 this line links passport to Google strategy

// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/auth', require('./routes/auth')); // 👈 added auth routes
app.use('/api/users', require('./routes/users'));
app.use('/api/cooperatives', require('./routes/cooperatives'));

// Health check route
app.get('/', (req, res) => res.json({ ok: true }));

// Error handler (must be last)
app.use(errorHandler);

// Server startup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
