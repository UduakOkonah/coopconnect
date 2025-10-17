// routes/users.js
const express = require("express");
const router = express.Router();
const users = require("../controllers/usersController");
const { check } = require("express-validator");
const { protect } = require("../middleware/auth");

// Register user
router.post(
  "/",
  [
    check("name").notEmpty().withMessage("Name required"),
    check("email").isEmail().withMessage("Valid email required"),
    check("password").isLength({ min: 6 }).withMessage("Password must be 6+ chars"),
  ],
  users.register
);

// Login user
router.post(
  "/login",
  [check("email").isEmail(), check("password").notEmpty()],
  users.login
);

// Get all users
router.get("/", protect, users.getAll);

// Get one user
router.get("/:id", protect, users.getOne);

// Update user
router.put("/:id", protect, users.update);

// Delete user
router.delete("/:id", protect, users.remove);

module.exports = router;
