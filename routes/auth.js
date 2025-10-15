// routes/auth.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const router = express.Router();

// Start Google OAuth flow
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Handle callback and issue JWT
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign(
      { sub: req.user._id, name: req.user.displayName, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Option 1: send token directly (for API)
    res.json({ message: "Login successful", token });

    // Option 2 (optional): redirect back to frontend
    // res.redirect(`${process.env.BASE_URL}/?token=${token}`);
  }
);

module.exports = router;
