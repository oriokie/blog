import jwt from "jsonwebtoken"
import User from "../models/User.js"
import { createError } from "../utils/error.js"

export const protect = async (req, res, next) => {
  try {
    let token

    // Get token from cookies or authorization header
    if (req.cookies.token) {
      token = req.cookies.token
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return next(createError(401, "Not authorized, no token"))
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from the token
    const user = await User.findById(decoded.id).select("-password")

    if (!user) {
      return next(createError(401, "Not authorized, user not found"))
    }

    req.user = user
    next()
  } catch (error) {
    next(createError(401, "Not authorized, token failed"))
  }
}

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    next(createError(403, "Not authorized as an admin"))
  }
}
