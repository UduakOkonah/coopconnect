// routes/contributions.js
const express = require('express');
const router = express.Router();
const contributions = require('../controllers/contributionsController');
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');

/**
 * @openapi
 * tags:
 *   name: Contributions
 *   description: Contribution management
 */

/**
 * @openapi
 * /api/contributions:
 *   post:
 *     tags: [Contributions]
 *     summary: Add a new contribution
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               memberId: { type: string }
 *               cooperativeId: { type: string }
 *               amount: { type: number }
 *           example:
 *             memberId: "670f3a1b84e2cd3b9005a9b1"
 *             cooperativeId: "670f3a1b84e2cd3b9005a9b2"
 *             amount: 5000
 *     responses:
 *       201:
 *         description: Contribution created
 */
router.post(
  '/',
  protect,
  authorize('admin', 'cooperativeManager'), // restricted roles
  [
    check('memberId').notEmpty().withMessage('Member ID required'),
    check('cooperativeId').notEmpty().withMessage('Cooperative ID required'),
    check('amount').isNumeric().withMessage('Amount must be a number'),
  ],
  contributions.createContribution
);

/**
 * @openapi
 * /api/contributions:
 *   get:
 *     tags: [Contributions]
 *     summary: Get all contributions
 *     responses:
 *       200:
 *         description: OK
 */
router.get('/', contributions.getAllContributions);

/**
 * @openapi
 * /api/contributions/{id}:
 *   get:
 *     tags: [Contributions]
 *     summary: Get a contribution by ID
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
router.get('/:id', contributions.getContributionById);

/**
 * @openapi
 * /api/contributions/{id}:
 *   put:
 *     tags: [Contributions]
 *     summary: Update a contribution by ID
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
 *             properties:
 *               amount: { type: number }
 *           example:
 *             amount: 7500
 *     responses:
 *       200:
 *         description: Contribution updated
 */
router.put(
  '/:id',
  protect,
  authorize('admin', 'cooperativeManager'),
  [check('amount').isNumeric().withMessage('Amount must be a number')],
  contributions.updateContribution
);

/**
 * @openapi
 * /api/contributions/{id}:
 *   delete:
 *     tags: [Contributions]
 *     summary: Delete a contribution by ID
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
 *         description: Contribution deleted
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'), // admin only
  contributions.deleteContribution
);

module.exports = router;