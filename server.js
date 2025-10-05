require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const connectDB = require('./config/db');
const { swaggerUi, specs } = require('./config/swagger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// connect database
connectDB();

app.use(helmet());
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/users', require('./routes/users'));
app.use('/api/cooperatives', require('./routes/cooperatives'));

// health check
app.get('/', (req, res) => res.json({ ok: true }));

// error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
