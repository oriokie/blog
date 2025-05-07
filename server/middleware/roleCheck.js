// Middleware to check user roles
const roleCheck = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - User not authenticated",
      })
    }

    if (roles.includes(req.user.role)) {
      next()
    } else {
      return res.status(403).json({
        success: false,
        message: "Forbidden - Insufficient permissions",
      })
    }
  }
}

export default roleCheck
