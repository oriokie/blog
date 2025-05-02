import User from "../models/User.js"
import { generateToken } from "../utils/generateToken.js"
import { createError } from "../utils/error.js"

// Register a new user
export const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password } = req.body

    // Check if user already exists
    const userExists = await User.findOne({ email })

    if (userExists) {
      return next(createError(400, "User already exists"))
    }

    // Create new user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    })

    // Generate token
    const token = generateToken(user._id)

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.status(201).json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    })
  } catch (error) {
    next(error)
  }
}

// Login user
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })

    // Check if user exists and password is correct
    if (!user || !(await user.comparePassword(password))) {
      return next(createError(401, "Invalid email or password"))
    }

    // Generate token
    const token = generateToken(user._id)

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.json({
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    })
  } catch (error) {
    next(error)
  }
}

// Logout user
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  })

  res.status(200).json({ message: "Logged out successfully" })
}

// Get current user profile
export const getCurrentUser = async (req, res) => {
  res.json(req.user)
}
