import express from "express"
import {
  getDashboardStats,
  getViewsData,
  getEngagementData,
  getRecentPosts,
} from "../controllers/dashboardController.js"
import { protect } from "../middleware/auth.js"

const router = express.Router()

router.get("/stats", protect, getDashboardStats)
router.get("/views", protect, getViewsData)
router.get("/engagement", protect, getEngagementData)
router.get("/recent-posts", protect, getRecentPosts)

export default router
