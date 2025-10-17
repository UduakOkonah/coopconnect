const express = require("express");
const router = express.Router();
const contributions = require("../controllers/contributionsController");
const { protect } = require("../middleware/auth");

/**
 * @openapi
 * /api/contributions:
 *   get:
 *     tags: [Contributions]
 *     summary: Get all contributions
 *     responses:
 *       200:
 *         description: List of contributions
 */
router.get("/", contributions.getAll);

/**
 * @openapi
 * /api/contributions/{id}:
 *   get:
 *     tags: [Contributions]
 *     summary: Get a contribution by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Contribution details
 */
router.get("/:id", contributions.getOne);

/**
 * @openapi
 * /api/contributions:
 *   post:
 *     tags: [Contributions]
 *     summary: Create a new contribution
 *     security:
 *       - bearerAuth: []
 */
router.post("/", protect, contributions.create);

/**
 * @openapi
 * /api/contributions/{id}:
 *   put:
 *     tags: [Contributions]
 *     summary: Update a contribution
 *     security:
 *       - bearerAuth: []
 */
router.put("/:id", protect, contributions.update);

/**
 * @openapi
 * /api/contributions/{id}:
 *   delete:
 *     tags: [Contributions]
 *     summary: Delete a contribution
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", protect, contributions.remove);

module.exports = router;
