"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Share2, Bookmark, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { postsAPI } from "@/lib/api"
import Head from "next/head"

export default function BlogPostPage({ params }: { params: { id: string } }) {
  const [post, setPost] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const { data } = await postsAPI.getPost(params.id)
        setPost(data)
      } catch (err) {
        console.error("Error fetching post:", err)
        setError("Failed to load the post. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{error || "Post Not Found"}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {error
            ? "We're having trouble loading this post."
            : "The blog post you're looking for doesn't exist or has been removed."}
        </p>
        <Link href="/blog">
          <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-full px-6 py-2">
            Back to Blog
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{post.title} | Apple Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.createdAt} />
        <meta property="article:author" content={`${post.author.firstName} ${post.author.lastName}`} />
        <meta property="article:section" content={post.category} />
      </Head>

      <article className="bg-white dark:bg-gray-950">
        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[70vh] bg-gray-900">
          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            fill
            className="object-cover opacity-70"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/30" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-24">
              <Link href="/blog" className="inline-flex items-center text-white mb-6 hover:underline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Blog
              </Link>
              <motion.h1
                className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                {post.title}
              </motion.h1>
              <motion.div
                className="flex flex-col sm:flex-row sm:items-center text-white/90 gap-4 sm:gap-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex items-center mr-0 sm:mr-6">
                  <div className="relative h-10 w-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src={post.author.avatar || "/placeholder.svg"}
                      alt={`${post.author.firstName} ${post.author.lastName}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{`${post.author.firstName} ${post.author.lastName}`}</p>
                    <div className="flex items-center text-sm text-white/70">
                      <time dateTime={post.createdAt}>
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                      </time>
                      <span className="mx-2">·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
                <div className="sm:ml-auto flex space-x-2">
                  <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                    <Share2 className="h-5 w-5" />
                    <span className="sr-only">Share</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="rounded-full text-white hover:bg-white/20">
                    <Bookmark className="h-5 w-5" />
                    <span className="sr-only">Bookmark</span>
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="prose dark:prose-invert lg:prose-lg prose-img:rounded-xl prose-headings:font-bold prose-headings:tracking-tight prose-a:text-gray-900 dark:prose-a:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Tags */}
            <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full">
                  {post.category}
                </span>
              </div>
            </div>

            {/* Author Bio */}
            <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-0">
                <div className="relative h-16 w-16 rounded-full overflow-hidden mr-0 sm:mr-4">
                  <Image
                    src={post.author.avatar || "/placeholder.svg"}
                    alt={`${post.author.firstName} ${post.author.lastName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{`${post.author.firstName} ${post.author.lastName}`}</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{post.author.bio || "Writer at Apple Blog"}</p>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h3>
              <div className="flex items-center justify-between p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                <div className="flex items-center">
                  <MessageSquare className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-gray-600 dark:text-gray-300">Join the conversation</span>
                </div>
                <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-full">
                  Add Comment
                </Button>
              </div>

              {/* Display comments if available */}
              {post.comments && post.comments.length > 0 ? (
                <div className="mt-6 space-y-6">
                  {post.comments.map((comment) => (
                    <div key={comment._id} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="flex items-start">
                        <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
                          <Image
                            src={comment.user.avatar || "/placeholder.svg"}
                            alt={`${comment.user.firstName} ${comment.user.lastName}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {`${comment.user.firstName} ${comment.user.lastName}`}
                            </h4>
                            <span className="mx-2 text-gray-400">•</span>
                            <time className="text-sm text-gray-500 dark:text-gray-400">
                              {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </time>
                          </div>
                          <p className="mt-2 text-gray-600 dark:text-gray-300">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl text-center">
                  <p className="text-gray-600 dark:text-gray-300">No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </article>
    </>
  )
}
