import type { Metadata } from "next"
import { postsAPI } from "@/lib/api"
import { BlogPostPage } from "./blog-post-page"

interface Post {
  _id: string
  title: string
  content: string
  excerpt: string
  coverImage: string
  author: {
    firstName: string
    lastName: string
    avatar: string
  }
  createdAt: string
  category: string
  tags: string[]
  readTime: string
  comments: any[]
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  try {
    const response = await postsAPI.getPost(params.id)
    const post = response.data as Post

    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage],
        type: "article",
        publishedTime: post.createdAt,
        authors: [`${post.author.firstName} ${post.author.lastName}`],
        tags: post.tags,
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.excerpt,
        images: [post.coverImage],
      },
    }
  } catch (error) {
    return {
      title: "Post Not Found",
      description: "The requested post could not be found.",
    }
  }
}

export default function Page({ params }: { params: { id: string } }) {
  return <BlogPostPage id={params.id} />
}
