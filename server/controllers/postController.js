import Post from "../models/Post.js"
import { createError } from "../utils/error.js"

// Get all posts
export const getPosts = async (req, res, next) => {
  try {
    const { category, limit = 10, page = 1 } = req.query
    const skip = (page - 1) * limit

    const query = category && category !== "All" ? { category } : {}

    const posts = await Post.find(query)
      .populate("author", "firstName lastName avatar")
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip)

    const total = await Post.countDocuments(query)

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    })
  } catch (error) {
    next(error)
  }
}

// Get featured posts
export const getFeaturedPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "firstName lastName avatar")
      .sort({ views: -1, createdAt: -1 })
      .limit(3)

    res.json(posts)
  } catch (error) {
    next(error)
  }
}

// Get recent posts
export const getRecentPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author", "firstName lastName avatar").sort({ createdAt: -1 }).limit(3)

    res.json(posts)
  } catch (error) {
    next(error)
  }
}

// Get post by ID or slug
export const getPost = async (req, res, next) => {
  try {
    const { id } = req.params

    let post

    // Check if id is a valid ObjectId
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      post = await Post.findById(id).populate("author", "firstName lastName avatar bio")
    } else {
      // If not, treat as slug
      post = await Post.findOne({ slug: id }).populate("author", "firstName lastName avatar bio")
    }

    if (!post) {
      return next(createError(404, "Post not found"))
    }

    // Increment view count
    post.views += 1
    await post.save()

    res.json(post)
  } catch (error) {
    next(error)
  }
}

// Create a new post
export const createPost = async (req, res, next) => {
  try {
    const { title, excerpt, content, coverImage, category, readTime } = req.body

    const post = await Post.create({
      title,
      excerpt,
      content,
      coverImage,
      category,
      readTime,
      author: req.user._id,
    })

    res.status(201).json(post)
  } catch (error) {
    next(error)
  }
}

// Update a post
export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, excerpt, content, coverImage, category, readTime } = req.body

    const post = await Post.findById(id)

    if (!post) {
      return next(createError(404, "Post not found"))
    }

    // Check if user is the author or an admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to update this post"))
    }

    post.title = title || post.title
    post.excerpt = excerpt || post.excerpt
    post.content = content || post.content
    post.coverImage = coverImage || post.coverImage
    post.category = category || post.category
    post.readTime = readTime || post.readTime

    const updatedPost = await post.save()

    res.json(updatedPost)
  } catch (error) {
    next(error)
  }
}

// Delete a post
export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params

    const post = await Post.findById(id)

    if (!post) {
      return next(createError(404, "Post not found"))
    }

    // Check if user is the author or an admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to delete this post"))
    }

    await post.remove()

    res.json({ message: "Post removed" })
  } catch (error) {
    next(error)
  }
}

// Add a comment to a post
export const addComment = async (req, res, next) => {
  try {
    const { id } = req.params
    const { text } = req.body

    const post = await Post.findById(id)

    if (!post) {
      return next(createError(404, "Post not found"))
    }

    post.comments.push({
      user: req.user._id,
      text,
    })

    await post.save()

    const updatedPost = await Post.findById(id).populate({
      path: "comments.user",
      select: "firstName lastName avatar",
    })

    res.json(updatedPost.comments)
  } catch (error) {
    next(error)
  }
}

// Like a post
export const likePost = async (req, res, next) => {
  try {
    const { id } = req.params

    const post = await Post.findById(id)

    if (!post) {
      return next(createError(404, "Post not found"))
    }

    post.likes += 1
    await post.save()

    res.json({ likes: post.likes })
  } catch (error) {
    next(error)
  }
}
