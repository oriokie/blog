import express from "express"
import { updateProfile, changePassword, getUsers } from "../controllers/userController.js"
import { protect, admin } from "../middleware/auth.js"

const router = express.Router()

router.put("/profile", protect, updateProfile)
router.put("/password", protect, changePassword)
router.get("/", protect, admin, getUsers)

export default router
