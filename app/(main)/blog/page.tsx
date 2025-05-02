"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import BlogCard from "@/components/blog-card"
import { postsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [categories, setCategories] = useState(["All"])
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")

  const searchParams = useSearchParams()
  const router = useRouter()

  const page = Number(searchParams.get("page") || "1")
  const category = searchParams.get("category") || "All"

  useEffect(() => {
    setSelectedCategory(category)
  }, [category])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch posts with pagination and category filter
        const params = {
          page,
          limit: 9,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          search: searchTerm,
        }

        const response = await postsAPI.getPosts(params)
        setPosts(response.data.posts)
        setTotalPages(response.data.totalPages)

        // Fetch all categories if we don't have them yet
        if (categories.length <= 1) {
          const uniqueCategories = ["All"]
          response.data.posts.forEach((post) => {
            if (!uniqueCategories.includes(post.category)) {
              uniqueCategories.push(post.category)
            }
          })
          setCategories(uniqueCategories)
        }
      } catch (err) {
        console.error("Error fetching posts:", err)
        setError("Failed to load posts. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [page, selectedCategory, searchTerm])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    router.push(`/blog?category=${category}&page=1${searchTerm ? `&search=${searchTerm}` : ""}`)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    router.push(`/blog?category=${selectedCategory}&page=${newPage}${searchTerm ? `&search=${searchTerm}` : ""}`)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    router.push(`/blog?category=${selectedCategory}&page=1&search=${searchTerm}`)
  }

  // Generate colors for category buttons
  const getCategoryColor = (index) => {
    const colors = [
      "from-apple-red to-apple-orange border-apple-red",
      "from-apple-blue to-apple-teal border-apple-blue",
      "from-apple-purple to-apple-pink border-apple-purple",
      "from-apple-green to-apple-mint border-apple-green",
      "from-apple-yellow to-apple-orange border-apple-yellow",
      "from-apple-teal to-apple-blue border-apple-teal",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
            <span className="colorful-gradient">Our Blog</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
            Insights, tutorials, and opinions on technology, design, and innovation.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="max-w-md mx-auto mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search articles..."
              className="w-full px-4 py-2 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pr-12 focus:outline-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-teal"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-apple-blue dark:bg-apple-teal text-white rounded-full hover:opacity-90 transition-opacity"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        </motion.div>

        <motion.div
          className="flex flex-wrap justify-center gap-2 mb-12 overflow-x-auto pb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {categories.map((category, index) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                selectedCategory === category
                  ? `bg-gradient-to-r ${getCategoryColor(index)} text-white shadow-md scale-105`
                  : "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700 hover:scale-105"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {error && (
          <div className="text-center text-red-500 dark:text-red-400 mb-8 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading
            ? Array(9)
                .fill(0)
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm animate-pulse"
                  >
                    <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700"></div>
                    <div className="p-6">
                      <div className="h-6 w-3/4 mb-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded"></div>
                      <div className="h-4 w-full mb-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded"></div>
                      <div className="h-4 w-full mb-2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded"></div>
                      <div className="h-4 w-2/3 mb-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded"></div>
                      <div className="flex items-center mt-4">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 mr-3"></div>
                        <div>
                          <div className="h-4 w-24 mb-1 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded"></div>
                          <div className="h-3 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
            : posts.map((post, index) => <BlogCard key={post._id} post={post} index={index} />)}
        </div>

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page <= 1}
              className="flex items-center border-apple-blue dark:border-apple-teal text-apple-blue dark:text-apple-teal hover:bg-apple-blue/10 dark:hover:bg-apple-teal/10"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>

            <div className="flex items-center space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <Button
                  key={pageNum}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-8 h-8 p-0 ${
                    pageNum === page
                      ? "bg-gradient-to-r from-apple-blue to-apple-teal text-white"
                      : "border-apple-blue/50 dark:border-apple-teal/50 text-apple-blue dark:text-apple-teal hover:bg-apple-blue/10 dark:hover:bg-apple-teal/10"
                  }`}
                >
                  {pageNum}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
              className="flex items-center border-apple-blue dark:border-apple-teal text-apple-blue dark:text-apple-teal hover:bg-apple-blue/10 dark:hover:bg-apple-teal/10"
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* No results message */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-2xl font-bold text-apple-purple dark:text-apple-pink mb-2">No posts found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("All")
                router.push("/blog")
              }}
              className="bg-gradient-rainbow text-white hover:opacity-90"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
