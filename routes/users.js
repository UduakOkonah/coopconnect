const express = require("express");
const router = express.Router();
const users = require("../controllers/usersController");
const { check } = require("express-validator");
const { protect } = require("../middleware/auth");

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @openapi
 * /api/users:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User registered successfully
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *
 * /api/users/login:
 *   post:
 *     summary: Login a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@email.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Logged in successfully
 *
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: User found
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: User updated successfully
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: User deleted successfully
 */

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
