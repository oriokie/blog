"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { postsAPI } from "@/lib/api"

interface RecommendedPost {
  _id: string
  title: string
  excerpt: string
  coverImage: string
  slug?: string
  category: string
}

interface ContentRecommendationsProps {
  currentPostId: string
  limit?: number
  className?: string
}

export function ContentRecommendations({ currentPostId, limit = 3, className }: ContentRecommendationsProps) {
  const [posts, setPosts] = useState<RecommendedPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true)
        // In a real implementation, you would have an API endpoint for recommendations
        // For now, we'll just fetch recent posts and filter out the current one
        const response = await postsAPI.getRecentPosts()
        const filteredPosts = response.data
          .filter((post: RecommendedPost) => post._id !== currentPostId)
          .slice(0, limit)

        setPosts(filteredPosts)
      } catch (error) {
        console.error("Error fetching recommendations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecommendations()
  }, [currentPostId, limit])

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <h3 className="text-xl font-bold">Recommended Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(limit)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-40 bg-gray-200 dark:bg-gray-800 animate-pulse" />
                <CardContent className="p-4">
                  <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-800 animate-pulse mb-2" />
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-800 animate-pulse" />
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-xl font-bold">Recommended Reading</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {posts.map((post) => {
          // Use slug if available, otherwise use _id
          const postUrl = `/blog/${post.slug || post._id}`

          return (
            <Link href={postUrl} key={post._id}>
              <Card className="overflow-hidden h-full transition-all duration-200 hover:shadow-md">
                <div className="relative h-40">
                  <Image src={post.coverImage || "/placeholder.svg"} alt={post.title} fill className="object-cover" />
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-medium line-clamp-2">{post.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{post.excerpt}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
