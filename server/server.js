import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import { notFound, errorHandler } from "./middleware/errorMiddleware.js"

// Route imports
import userRoutes from "./routes/userRoutes.js"
import postRoutes from "./routes/postRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js"
import tagRoutes from "./routes/tagRoutes.js"
import settingsRoutes from "./routes/settingsRoutes.js"
import documentRoutes from "./routes/documentRoutes.js"
import digitalProductRoutes from "./routes/digitalProductRoutes.js"
import affiliateLinkRoutes from "./routes/affiliateLinkRoutes.js"
import pageContentRoutes from "./routes/pageContent.js"
import paypalRoutes from "./routes/paypalRoutes.js"

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/tags", tagRoutes)
app.use("/api/settings", settingsRoutes)
app.use("/api/documents", documentRoutes)
app.use("/api/products", digitalProductRoutes)
app.use("/api/affiliate", affiliateLinkRoutes)
app.use("/api/page-content", pageContentRoutes)
app.use("/api/payments/paypal", paypalRoutes)

// Error handling middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
