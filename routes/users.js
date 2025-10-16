// routes/users.js
const express = require('express');
const router = express.Router();
const users = require('../controllers/usersController');
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const passport = require('passport');
require('../config/passport'); // make sure passport strategies are loaded

/**
 * @openapi
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @openapi
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Register a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Sister Eke"
 *               email:
 *                 type: string
 *                 example: "eke@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Created
 */
router.post(
  '/',
  [
    check('name').notEmpty().withMessage('Name required'),
    check('email').isEmail().withMessage('Valid email required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be 6+ chars'),
    check('role')
      .optional()
      .isIn(['user', 'admin'])
      .withMessage('Role must be either user or admin')
  ],
  users.register
);

/**
 * @openapi
 * /api/users/login:
 *   post:
 *     tags: [Users]
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "eke@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OK
 */
router.post(
  '/login',
  [
    check('email').isEmail(),
    check('password').notEmpty()
  ],
  users.login
);

// ------------------ GOOGLE OAUTH ROUTES ------------------ //
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/api/users/auth/google/failure' }),
  async (req, res) => {
    const token = req.user.getSignedJwtToken();
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Google Login Successful</title>
          <style>
            body { font-family: Arial, sans-serif; background: #f4f7fb; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #333; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: center; width: 400px; }
            a { display:inline-block; text-decoration:none; background:#007bff; color:white; padding:10px 20px; border-radius:5px; font-size:16px; margin-top:20px; }
            input { width: 100%; padding: 8px; margin-top: 10px; text-align: center; border: 1px solid #ccc; border-radius: 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>✅ Google OAuth Login Successful</h2>
            <p>Copy your token below and test secured routes in Swagger.</p>
            <input value="${token}" readonly />
            <a href="/api-docs">Go to Swagger Docs</a>
          </div>
        </body>
      </html>
    `);
  }
);

// ------------------ PROTECTED USER ROUTES ------------------ //

/**
 * @openapi
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   role:
 *                     type: string
 */
router.get('/', protect, authorize('admin'), users.getAll);

/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags: [Users]
 *     summary: Get one user by ID
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
 *         description: OK
 */
router.get('/:id', protect, authorize('admin', 'cooperativeManager'), users.getOne);

/**
 * @openapi
 * /api/users/{id}:
 *   put:
 *     tags: [Users]
 *     summary: Update a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *     responses:
 *       200:
 *         description: Updated user
 */
router.put(
  '/:id',
  protect,
  authorize('admin', 'cooperativeManager'),
  [
    check('name').optional().notEmpty().withMessage('Name cannot be empty'),
    check('email').optional().isEmail().withMessage('Email must be valid'),
  ],
  users.update
);

/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags: [Users]
 *     summary: Delete a user by ID
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
 *         description: Deleted
 */
router.delete('/:id', protect, authorize('admin'), users.remove);

module.exports = router;