const express = require('express');
const router = express.Router();
const posts = require('../controllers/postsController');
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');

/**
 * @openapi
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @openapi
 * /api/posts:
 *   post:
 *     tags: [Posts]
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - authorId
 *               - cooperativeId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Cooperative Update"
 *               content:
 *                 type: string
 *                 example: "We have successfully launched our new savings program."
 *               authorId:
 *                 type: string
 *                 example: "652f9b2c3a1e12c4b5d6f7a8"
 *               cooperativeId:
 *                 type: string
 *                 example: "652f9b2c3a1e12c4b5d6f7b9"
 *     responses:
 *       201:
 *         description: Post created successfully
 */
router.post(
  '/',
  protect,
  authorize('admin', 'cooperativeManager'),
  [
    check('title').notEmpty().withMessage('Title is required'),
    check('content').notEmpty().withMessage('Content is required'),
    check('authorId').notEmpty().withMessage('Author ID is required'),
    check('cooperativeId').notEmpty().withMessage('Cooperative ID is required'),
  ],
  posts.createPost
);

/**
 * @openapi
 * /api/posts:
 *   get:
 *     tags: [Posts]
 *     summary: Get all posts
 *     responses:
 *       200:
 *         description: List of all posts
 */
router.get('/', posts.getAllPosts);

/**
 * @openapi
 * /api/posts/{id}:
 *   get:
 *     tags: [Posts]
 *     summary: Get a post by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post details
 */
router.get('/:id', posts.getPostById);

/**
 * @openapi
 * /api/posts/{id}:
 *   put:
 *     tags: [Posts]
 *     summary: Update a post by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               content: { type: string }
 *     responses:
 *       200:
 *         description: Post updated successfully
 */
router.put(
  '/:id',
  protect,
  authorize('admin', 'cooperativeManager'),
  [
    check('title')
      .optional()
      .notEmpty()
      .withMessage('Title cannot be empty'),
    check('content')
      .optional()
      .notEmpty()
      .withMessage('Content cannot be empty'),
  ],
  posts.updatePost
);

/**
 * @openapi
 * /api/posts/{id}:
 *   delete:
 *     tags: [Posts]
 *     summary: Delete a post by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Post ID
 *     responses:
 *       200:
 *         description: Post deleted successfully
 */
router.delete(
  '/:id',
  protect,
  authorize('admin'),
  posts.deletePost
);

module.exports = router;
