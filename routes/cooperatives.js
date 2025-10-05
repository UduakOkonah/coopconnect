// const express = require('express');
// const router = express.Router();
// const coops = require('../controllers/cooperativescontroller'); 
// const { check } = require('express-validator');
// const { protect, authorize } = require('../middleware/auth');

// /**
//  * @openapi
//  * tags:
//  *   name: Cooperatives
//  *   description: Cooperative management
//  */

// /**
//  * @openapi
//  * /api/cooperatives:
//  *   post:
//  *     tags: [Cooperatives]
//  *     summary: Create a cooperative
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             properties:
//  *               name: { type: string }
//  *               description: { type: string }
//  *               location: { type: string }
//  *           example:
//  *             name: "Lawrence Okonah"
//  *             description: "UyiaHub for Tech Hubs"
//  *             location: "Uyo"
//  *     responses:
//  *       201:
//  *         description: Cooperative created
//  */
// router.post(
//   '/',
//   protect,
//   [check('name').notEmpty().withMessage('Name required')],
//   coops.create
// );

// /**
//  * @openapi
//  * /api/cooperatives:
//  *   get:
//  *     tags: [Cooperatives]
//  *     summary: Get all cooperatives
//  *     responses:
//  *       200:
//  *         description: OK
//  */
// router.get('/', coops.getAll);

// /**
//  * @openapi
//  * /api/cooperatives/{id}:
//  *   get:
//  *     tags: [Cooperatives]
//  *     summary: Get one cooperative
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: OK
//  */
// router.get('/:id', coops.getOne);

// /**
//  * @openapi
//  * /api/cooperatives/{id}:
//  *   put:
//  *     tags: [Cooperatives]
//  *     summary: Update a cooperative
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             properties:
//  *               name: { type: string }
//  *               description: { type: string }
//  *               location: { type: string }
//  *           example:
//  *             name: "Updated Cooperative"
//  *             description: "Updated description"
//  *             location: "Lagos"
//  *     responses:
//  *       200:
//  *         description: Cooperative updated
//  *         content:
//  *           application/json:
//  *             example:
//  *               _id: "60f7f3c2e815cd23a4b5d9a1"
//  *               name: "Updated Cooperative"
//  *               description: "Updated description"
//  *               location: "Lagos"
//  */
// router.put('/:id', protect, coops.update);

// /**
//  * @openapi
//  * /api/cooperatives/{id}:
//  *   delete:
//  *     tags: [Cooperatives]
//  *     summary: Delete a cooperative
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         schema:
//  *           type: string
//  *         required: true
//  *     responses:
//  *       200:
//  *         description: Cooperative deleted
//  *         content:
//  *           application/json:
//  *             example:
//  *               message: "Cooperative deleted successfully"
//  */
// router.delete('/:id', protect, authorize('admin'), coops.remove);

// module.exports = router;
