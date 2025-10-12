const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

/**
 * ✅ Register user (auto-assign admin if first)
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // ✅ Check if there are any admins in the database
    const adminExists = await User.exists({ role: 'admin' });

    // ✅ Assign role
    let assignedRole;
    if (!adminExists) {
      assignedRole = 'admin';
      console.log('🟢 First user registered → assigned as admin');
    } else {
      assignedRole = role && req.user && req.user.role === 'admin' ? role : 'user';
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole
    });


    // Create token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(201).json({
      id: user._id,
      name: user.name,
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
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // ✅ Explicitly include password even if schema hides it
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials (user not found)' });
    }

    console.log("🟡 Found user:", user.email, "Hashed password:", user.password);

    // ✅ Compare using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials (password mismatch)' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ success: false, message: err.message });
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
