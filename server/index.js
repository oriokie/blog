import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.js"
import postRoutes from "./routes/posts.js"
import userRoutes from "./routes/users.js"
import dashboardRoutes from "./routes/dashboard.js"
import { errorHandler } from "./middleware/errorHandler.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.json())
app.use(cookieParser())
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/users", userRoutes)
app.use("/api/dashboard", dashboardRoutes)

// Error handling middleware
app.use(errorHandler)

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB")
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error)
  })
