// routes/users.js
const express = require('express');
const router = express.Router();
const users = require('../controllers/usersController');
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');

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
 *         description: OK
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
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  users.remove
);

module.exports = router;
