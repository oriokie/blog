import type { MetadataRoute } from "next"
import { postsAPI } from "@/lib/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all posts
  let posts = []
  try {
    const response = await postsAPI.getPosts({ limit: 100 })
    posts = response.data.posts
  } catch (error) {
    console.error("Error fetching posts for sitemap:", error)
  }

  // Base URLs
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apple-blog.vercel.app"

  // Static routes
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/login`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ]

  // Add blog posts to sitemap
  const postUrls = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug || post._id}`,
    lastModified: new Date(post.updatedAt || post.createdAt),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...routes, ...postUrls]
}
