// controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

/**
 * Helper: Generate a JWT token for a user
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      provider: user.provider,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * @desc Register a new user (local)
 * @route POST /auth/register
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user (password hashing handled in pre-save hook)
    const user = await User.create({ name, email, password, provider: 'local' });

    // Generate JWT
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc Login a user (local)
 * @route POST /auth/login
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password (for local users only)
    if (user.provider === 'google') {
      return res.status(400).json({ message: 'Use Google login for this account' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate token
    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        provider: user.provider,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @desc Google OAuth callback
 * @route GET /auth/google/callback
 */
exports.googleCallback = async (req, res) => {
  try {
    // Passport sets req.user if Google login succeeded
    if (!req.user) return res.status(401).json({ message: 'Google authentication failed' });

    // Generate JWT for the Google user
    const token = generateToken(req.user);

    // Option 1: Return JSON token (for API)
    // res.status(200).json({ success: true, token, user: req.user });

    // Option 2: Redirect to frontend with token (better for browser login)
    const redirectUrl = `${process.env.FRONTEND_URL}?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error('Google Callback Error:', error.message);
    res.status(500).json({ message: 'Server error during Google OAuth' });
  }
};
