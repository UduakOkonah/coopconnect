const express = require("express");
const router = express.Router();
const cooperatives = require("../controllers/cooperativesontroller");
const { protect } = require("../middleware/auth");

/**
 * @openapi
 * /api/cooperatives:
 *   get:
 *     tags: [Cooperatives]
 *     summary: Get all cooperatives
 */
router.get("/", cooperatives.getAll);

/**
 * @openapi
 * /api/cooperatives/{id}:
 *   get:
 *     tags: [Cooperatives]
 *     summary: Get a cooperative by ID
 */
router.get("/:id", cooperatives.getOne);

/**
 * @openapi
 * /api/cooperatives:
 *   post:
 *     tags: [Cooperatives]
 *     summary: Create a cooperative
 *     security:
 *       - bearerAuth: []
 */
router.post("/", protect, cooperatives.create);

/**
 * @openapi
 * /api/cooperatives/{id}:
 *   put:
 *     tags: [Cooperatives]
 *     summary: Update cooperative
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", protect, cooperatives.update);

/**
 * @openapi
 * /api/cooperatives/{id}:
 *   delete:
 *     tags: [Cooperatives]
 *     summary: Delete cooperative
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", protect, cooperatives.remove);

module.exports = router;
