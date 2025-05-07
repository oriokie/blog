"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface BlogCardProps {
  post: {
    _id: string
    title: string
    excerpt: string
    coverImage: string
    createdAt: string
    author: {
      firstName: string
      lastName: string
      avatar: string
    }
    category: string
    slug?: string
  }
  index: number
}

export default function BlogCard({ post, index }: BlogCardProps) {
  // Use slug if available, otherwise use _id
  const postUrl = `/blog/${post.slug || post._id}`

  // Determine category color class
  const getCategoryClass = (category: string | undefined) => {
    if (!category) return "category-badge-default"
    const lowerCategory = String(category).toLowerCase()
    if (lowerCategory.includes("tech")) return "category-badge-technology"
    if (lowerCategory.includes("design")) return "category-badge-design"
    if (lowerCategory.includes("dev")) return "category-badge-development"
    if (lowerCategory.includes("privacy")) return "category-badge-privacy"
    if (lowerCategory.includes("sustain")) return "category-badge-sustainability"
    if (lowerCategory.includes("ux")) return "category-badge-ux"
    return "category-badge-default"
  }

  // Determine card gradient based on index
  const cardGradients = [
    "from-apple-red/5 to-apple-orange/5",
    "from-apple-blue/5 to-apple-teal/5",
    "from-apple-purple/5 to-apple-pink/5",
    "from-apple-green/5 to-apple-mint/5",
    "from-apple-yellow/5 to-apple-orange/5",
    "from-apple-teal/5 to-apple-blue/5",
  ]

  const gradientClass = cardGradients[index % cardGradients.length]

  return (
    <motion.article
      className={`group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gradient-to-br ${gradientClass} dark:bg-opacity-10 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Link href={postUrl} className="absolute inset-0 z-10" aria-label={post.title}>
        <span className="sr-only">View article</span>
      </Link>
      <div className="relative h-48 overflow-hidden rounded-t-lg">
        <Image
          src={post.coverImage || "/placeholder.svg"}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute bottom-4 left-4">
          <span className={`category-badge ${getCategoryClass(post.category)}`}>{post.category}</span>
        </div>
      </div>
      <div className="flex flex-1 flex-col justify-between p-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold leading-tight text-gray-900 dark:text-white group-hover:text-apple-blue dark:group-hover:text-apple-teal transition-colors duration-300 line-clamp-2">
            {post.title}
          </h3>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{post.excerpt}</p>
        </div>
        <div className="mt-6 flex items-center">
          <div className="relative h-8 w-8 rounded-full overflow-hidden ring-2 ring-apple-blue dark:ring-apple-teal">
            <Image
              src={post.author.avatar || "/placeholder.svg"}
              alt={`${post.author.firstName} ${post.author.lastName}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {`${post.author.firstName} ${post.author.lastName}`}
            </p>
            <div className="flex space-x-1 text-xs text-gray-500 dark:text-gray-400">
              <time dateTime={post.createdAt}>
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </time>
              <span aria-hidden="true">&middot;</span>
              <span>5 min read</span>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
