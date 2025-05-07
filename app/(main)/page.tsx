"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Search, TrendingUp, Clock, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BlogCard from "@/components/blog-card"
import { postsAPI } from "@/lib/api"

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [trendingPosts, setTrendingPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const [featuredRes, recentRes, trendingRes] = await Promise.all([
          postsAPI.getFeaturedPosts(),
          postsAPI.getRecentPosts(),
          postsAPI.getTrendingPosts(),
        ])

        setFeaturedPosts(featuredRes.data)
        setRecentPosts(recentRes.data)
        setTrendingPosts(trendingRes.data || [])
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <div className="flex flex-col">
      {/* Hero Section - Simplified for blog focus */}
      <section className="relative py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
                OriokieX
              </span>
            </motion.h1>

            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover stories, ideas, and expertise from writers on any topic.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="max-w-lg mx-auto mb-12"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search articles..."
                  className="pl-10 py-6 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <Tabs defaultValue="featured" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Featured
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Recent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="featured" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading
                  ? Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm p-4 h-96 animate-pulse"
                        >
                          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                          <div className="mt-4 flex items-center">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full mr-3"></div>
                            <div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-1"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                            </div>
                          </div>
                        </div>
                      ))
                  : featuredPosts.map((post, index) => <BlogCard key={post._id} post={post} index={index} />)}
              </div>
            </TabsContent>

            <TabsContent value="trending" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading
                  ? Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm p-4 h-96 animate-pulse"
                        >
                          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                          <div className="mt-4 flex items-center">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full mr-3"></div>
                            <div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-1"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                            </div>
                          </div>
                        </div>
                      ))
                  : trendingPosts.map((post, index) => <BlogCard key={post._id} post={post} index={index} />)}
              </div>
            </TabsContent>

            <TabsContent value="recent" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {loading
                  ? Array(6)
                      .fill(0)
                      .map((_, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm p-4 h-96 animate-pulse"
                        >
                          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4"></div>
                          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full mb-2"></div>
                          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3"></div>
                          <div className="mt-4 flex items-center">
                            <div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-full mr-3"></div>
                            <div>
                              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24 mb-1"></div>
                              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-32"></div>
                            </div>
                          </div>
                        </div>
                      ))
                  : recentPosts.map((post, index) => <BlogCard key={post._id} post={post} index={index} />)}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-full px-8 py-3">
                Explore All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Never miss a story
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Get the best articles delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-gray-100"
                required
              />
              <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-full px-6 py-3">
                Subscribe
              </Button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
