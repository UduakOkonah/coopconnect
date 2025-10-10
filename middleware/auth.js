const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Middleware: Protect routes using JWT
 */
async function protect(req, res, next) {
  const header = req.headers.authorization;

  // Ensure Bearer token exists
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, token missing' });
  }

  const token = header.split(' ')[1];

  try {
    // Verify token and decode payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user and exclude password
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('JWT verification error:', err.message);
    return res.status(401).json({ message: 'Token is invalid or expired' });
  }
}

/**
 * Middleware: Restrict access by role (optional feature)
 * If your User model doesn’t yet have a role field, you can safely skip using this.
 */
function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no user found' });
    }

    // If the user model has no role, default to 'user'
    const userRole = req.user.role || 'user';

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }

    next();
  };
}

module.exports = { protect, authorize };
