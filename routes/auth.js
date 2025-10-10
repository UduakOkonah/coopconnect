// routes/auth.js
const express = require('express');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Local register
router.post('/register',
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return authController.register(req,res,next);
  }
);

// Local login
router.post('/login',
  body('email').isEmail(),
  body('password').exists(),
  async (req,res,next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    return authController.login(req,res,next);
  }
);

// Google OAuth start
router.get('/google', passport.authenticate('google', { scope: ['profile','email'] }));

// Google OAuth callback
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

// Logout for session-based (if you support sessions)
router.post('/logout', (req, res) => {
  req.logout?.();
  res.status(200).json({ message: 'Logged out' });
});

module.exports = router;
