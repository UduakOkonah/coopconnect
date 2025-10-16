const User = require('../models/user');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * Generate JWT
 */
exports.generateJwt = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * ✅ Register user (auto-assign admin if first)
 */
exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    if (await User.findOne({ email })) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Auto-assign admin if first user
    const adminExists = await User.exists({ role: 'admin' });
    const assignedRole = !adminExists
      ? 'admin'
      : role && req.user?.role === 'admin'
      ? role
      : 'user';

    // ✅ Create user (fixed)
    const user = await User.create({
      username: name || email.split('@')[0], // use provided name or derive from email
      email,
      password: password || Math.random().toString(36).slice(-8), // generate password if missing
      role: assignedRole
    });

    // Generate token using schema method
    const token = user.getSignedJwtToken();

    res.status(201).json({
      id: user._id,
      name: user.username, // since you used `username` in your model
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    console.error('❌ Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


/**
 * ✅ Login user and return JWT
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
/**
 * Get all users (admin only)
 */
exports.getAll = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    next(err);
  }
};

/**
 * Get one user by ID
 */
exports.getOne = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

/**
 * Update a user (admin can also modify role)
 */
exports.update = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    // Allow only certain fields
    const allowedUpdates = ['name', 'email'];
    if (req.user.role === 'admin') allowedUpdates.push('role');

    allowedUpdates.forEach((key) => {
      if (req.body[key] !== undefined) {
        user[key] = req.body[key];
      }
    });

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

/**
 * Delete a user (admin only)
 */
exports.remove = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};

/**
 * Generate JWT for a user
 */
exports.generateJwt = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
};

/**
 * Get user by ID (for Passport deserialization)
 */
exports.getUserById = async (id) => {
  try {
    const user = await User.findById(id).select('-password');
    return user;
  } catch (error) {
    console.error('❌ Error fetching user by ID:', error);
    throw error;
  }
};


/**
 * Find or create a Google user (auto-assign admin if first)
 */
exports.findOrCreateGoogleUser = async (profile) => {
  const email = profile.emails[0].value;
  let user = await User.findOne({ email });

  // Check if any admin exists in DB
  const adminExists = await User.exists({ role: 'admin' });
  const assignedRole = !adminExists ? 'admin' : 'user';

  if (!user) {
    user = await User.create({
      name: profile.displayName,
      email,
      password: Math.random().toString(36).slice(-8), // random password
      role: assignedRole
    });
    console.log('🟢 New Google user created:', email, 'Role:', assignedRole);
  } else {
    console.log('🟡 Existing Google user:', email);
  }

  return user;
};
