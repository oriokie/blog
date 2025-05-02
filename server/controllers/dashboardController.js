import Post from "../models/Post.js"
import User from "../models/User.js"

// Get dashboard stats
export const getDashboardStats = async (req, res, next) => {
  try {
    // Get total views, likes, comments, and subscribers
    const posts = await Post.find({ author: req.user._id })

    const totalViews = posts.reduce((acc, post) => acc + post.views, 0)
    const totalLikes = posts.reduce((acc, post) => acc + post.likes, 0)
    const totalComments = posts.reduce((acc, post) => acc + post.comments.length, 0)

    // Get total subscribers (for admin only)
    const totalSubscribers = req.user.role === "admin" ? await User.countDocuments({ role: "user" }) : 0

    res.json({
      totalViews,
      totalLikes,
      totalComments,
      totalSubscribers,
    })
  } catch (error) {
    next(error)
  }
}

// Get views data for chart
export const getViewsData = async (req, res, next) => {
  try {
    // Get views data for the last 7 months
    const viewsData = []
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

    // In a real app, you would query the database for actual data
    // This is a simplified example
    for (let i = 0; i < months.length; i++) {
      viewsData.push({
        name: months[i],
        views: Math.floor(Math.random() * 5000) + 3000,
      })
    }

    res.json(viewsData)
  } catch (error) {
    next(error)
  }
}

// Get engagement data for chart
export const getEngagementData = async (req, res, next) => {
  try {
    // Get engagement data for the last 7 months
    const engagementData = []
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"]

    // In a real app, you would query the database for actual data
    // This is a simplified example
    for (let i = 0; i < months.length; i++) {
      const likes = Math.floor(Math.random() * 3000) + 1500
      engagementData.push({
        name: months[i],
        likes,
        comments: Math.floor(likes * 0.7),
      })
    }

    res.json(engagementData)
  } catch (error) {
    next(error)
  }
}

// Get recent posts for dashboard
export const getRecentPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .limit(4)
      .select("title views likes comments createdAt")

    res.json(posts)
  } catch (error) {
    next(error)
  }
}
