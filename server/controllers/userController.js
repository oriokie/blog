import User from "../models/User.js"
import { createError } from "../utils/error.js"

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, bio, avatar } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
      return next(createError(404, "User not found"))
    }

    user.firstName = firstName || user.firstName
    user.lastName = lastName || user.lastName
    user.bio = bio || user.bio
    user.avatar = avatar || user.avatar

    const updatedUser = await user.save()

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      bio: updatedUser.bio,
      role: updatedUser.role,
    })
  } catch (error) {
    next(error)
  }
}

// Change password
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    const user = await User.findById(req.user._id)

    if (!user) {
      return next(createError(404, "User not found"))
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword)

    if (!isMatch) {
      return next(createError(400, "Current password is incorrect"))
    }

    user.password = newPassword
    await user.save()

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    next(error)
  }
}

// Get all users (admin only)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password")
    res.json(users)
  } catch (error) {
    next(error)
  }
}
