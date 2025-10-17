const express = require("express");
const router = express.Router();
const posts = require("../controllers/postsController");
const { protect, authorize } = require("../middleware/auth");
const { check } = require("express-validator");

/**
 * @openapi
 * tags:
 *   name: Posts
 *   description: Cooperative posts and announcements
 */

/**
 * @openapi
 * /api/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of all posts
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       201:
 *         description: Post created successfully
 *
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Post found
 *   put:
 *     summary: Update a post
 *     tags: [Posts]
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
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Post updated successfully
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
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
 *         description: Post deleted successfully
 */

router.get("/", posts.getAllPosts);
router.get("/:id", posts.getPostById);

router.post(
  "/",
  protect,
  authorize("admin", "cooperativeManager"),
  [
    check("title").notEmpty(),
    check("content").notEmpty(),
    check("authorId").notEmpty(),
    check("cooperativeId").notEmpty(),
  ],
  posts.createPost
);

router.put(
  "/:id",
  protect,
  authorize("admin", "cooperativeManager"),
  posts.updatePost
);

router.delete("/:id", protect, authorize("admin"), posts.deletePost);

module.exports = router;
