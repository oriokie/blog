"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import BlogCard from "@/components/blog-card"
import { postsAPI } from "@/lib/api"

export default function Home() {
  const [featuredPosts, setFeaturedPosts] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        const [featuredRes, recentRes] = await Promise.all([postsAPI.getFeaturedPosts(), postsAPI.getRecentPosts()])

        setFeaturedPosts(featuredRes.data)
        setRecentPosts(recentRes.data)
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
      {/* Hero Section */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900 pt-16">
        <motion.div
          className="container mx-auto px-4 md:px-6 text-center relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Thoughts on
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400">
              Technology & Design
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Exploring the intersection of technology, design, and innovation through the lens of Apple's philosophy.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
          >
            <Link href="/blog">
              <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-full px-8 py-6 text-lg">
                Read the Blog
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full px-8 py-6 text-lg"
              >
                About Us
              </Button>
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center z-0 mt-24"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <Image
            src="/placeholder.svg?height=800&width=1200"
            alt="Blog Hero"
            width={1200}
            height={800}
            className="max-w-full h-auto object-contain opacity-70 dark:opacity-40"
            priority
          />
        </motion.div>

        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            repeat: Number.POSITIVE_INFINITY,
            duration: 1.5,
            ease: "easeInOut",
          }}
        >
          <ChevronDown className="h-8 w-8 text-gray-400" />
        </motion.div>
      </section>

      {/* Featured Posts Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Featured Articles
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">
              Our most impactful and thought-provoking pieces.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? Array(3)
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
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Subscribe to our newsletter for the latest articles, insights, and updates.
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

      {/* Recent Posts Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-4">
              Recent Articles
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300">The latest from our blog.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loading
              ? Array(3)
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

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full px-8 py-3"
              >
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
