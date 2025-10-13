const express = require('express');
const router = express.Router();
const controller = require('../controllers/cooperativescontroller');

/**
 * @swagger
 * /api/cooperatives:
 *   get:
 *     summary: Get all cooperatives
 */
router.get('/', controller.getAllCooperatives);

/**
 * @swagger
 * /api/cooperatives/{id}:
 *   get:
 *     summary: Get a cooperative by ID
 */
router.get('/:id', controller.getCooperativeById);

/**
 * @swagger
 * /api/cooperatives:
 *   post:
 *     summary: Create a new cooperative
 */
router.post('/', controller.createCooperative);

/**
 * @swagger
 * /api/cooperatives/{id}:
 *   put:
 *     summary: Update a cooperative
 */
router.put('/:id', controller.updateCooperative);

/**
 * @swagger
 * /api/cooperatives/{id}:
 *   delete:
 *     summary: Delete a cooperative
 */
router.delete('/:id', controller.deleteCooperative);

module.exports = router;
