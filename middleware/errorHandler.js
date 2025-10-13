// middleware/errorHandler.js

/**
 * Centralized error handling middleware
 * Ensures consistent API error responses
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);

  // Determine the correct status code
  const statusCode = err.statusCode || 500;

  // Common error type handling (optional but useful)
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // Default structured response
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Server Error',
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
  });
};

module.exports = errorHandler;
