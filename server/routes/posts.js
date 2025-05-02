import express from "express"
import {
  getPosts,
  getFeaturedPosts,
  getRecentPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
  addComment,
  likePost,
} from "../controllers/postController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.get("/", getPosts)
router.get("/featured", getFeaturedPosts)
router.get("/recent", getRecentPosts)
router.get("/:id", getPost)
router.post("/", protect, createPost)
router.put("/:id", protect, updatePost)
router.delete("/:id", protect, deletePost)
router.post("/:id/comments", protect, addComment)
router.post("/:id/like", protect, likePost)

export default router
