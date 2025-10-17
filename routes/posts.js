const express = require("express");
const router = express.Router();
const posts = require("../controllers/postsController");
const { protect, authorize } = require("../middleware/auth");
const { check } = require("express-validator");

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
