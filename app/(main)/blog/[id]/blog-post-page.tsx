"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { ArrowLeft, Bookmark, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { postsAPI, subscriptionAPI, settingsAPI, bookmarkAPI } from "@/lib/api"
import { SocialShare } from "@/components/social-share"
import { NewsletterSubscription } from "@/components/newsletter-subscription"
import { ContentRecommendations } from "@/components/content-recommendations"
import { useToast } from "@/hooks/use-toast"
import { BlockchainVerification } from "@/components/blockchain-verification"
import { SponsoredSection } from "@/components/sponsored-content/sponsored-section"
import { useAuth } from "@/contexts/auth-context"
import { PremiumContent } from "@/components/premium-content"
import { ExitIntentPopup } from "@/components/exit-intent-popup"

interface Post {
  _id: string
  title: string
  content: string
  excerpt: string
  coverImage: string
  author: {
    _id: string
    firstName: string
    lastName: string
    avatar?: string
    bio?: string
  }
  createdAt: string
  category: string
  tags: string[]
  slug: string
  premium: boolean
  readTime: string
  price?: number
  currency?: string
  comments: Array<{
    _id: string
    content: string
    author: {
      _id: string
      firstName: string
      lastName: string
      avatar?: string
    }
    createdAt: string
    user?: {
      _id: string
      firstName: string
      lastName: string
      avatar?: string
    }
  }>
}

export function BlogPostPage({ id }: { id: string }) {
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [comments, setComments] = useState<Post['comments']>([])
  const [hasAdFreeAccess, setHasAdFreeAccess] = useState(false)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [exitPopupSettings, setExitPopupSettings] = useState({
    enabled: true,
    title: "Before You Go!",
    description: "Subscribe to our newsletter to get the latest updates and exclusive content.",
    ctaText: "Subscribe Now",
    ctaUrl: "#",
    newsletterEnabled: true,
  })
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await postsAPI.getPost(id)
        const postData = response.data as Post
        setPost(postData)
        setComments(postData.comments || [])
      } catch (error) {
        setError("Failed to load post")
      } finally {
        setIsLoading(false)
      }
    }

    fetchPost()
  }, [id])

  const handleCommentSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!post || !commentText.trim()) return

    try {
      setSubmittingComment(true)
      const response = await postsAPI.addComment(post._id, commentText)
      const newComment = response.data
      setComments([...comments, newComment])
      setCommentText("")
      toast({
        title: "Success",
        description: "Comment added successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleBookmark = async () => {
    if (!post) return

    try {
      if (isBookmarked) {
        await bookmarkAPI.removeBookmark(post._id)
        setIsBookmarked(false)
        toast({
          title: "Removed from bookmarks",
          description: "This post has been removed from your bookmarks",
        })
      } else {
        await bookmarkAPI.addBookmark(post._id)
        setIsBookmarked(true)
        toast({
          title: "Bookmarked",
          description: "This post has been added to your bookmarks",
        })
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error)
      toast({
        title: "Error",
        description: "Failed to update bookmark. Please try again.",
        variant: "destructive",
      })
    }
  }

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

  const postUrl = typeof window !== "undefined" ? window.location.href : ""
  const isPremium = post.premium || false

  // Render exit intent popup if enabled
  const renderExitPopup = exitPopupSettings.enabled && (
    <ExitIntentPopup
      title={exitPopupSettings.title}
      description={exitPopupSettings.description}
      ctaText={exitPopupSettings.ctaText}
      ctaUrl={exitPopupSettings.ctaUrl}
      newsletterEnabled={exitPopupSettings.newsletterEnabled}
    />
  )

  return (
    <>
      {renderExitPopup}

      <article className="bg-white dark:bg-gray-950">
        {/* Show ad only if user doesn't have ad-free access */}
        {!hasAdFreeAccess && (
          <div className="container mx-auto px-4 md:px-6 py-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Want an ad-free experience?{" "}
                <Link href="/subscription" className="font-medium underline">
                  Subscribe now
                </Link>
              </p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="relative h-[40vh] md:h-[60vh] bg-gray-900">
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
                      <span>{post.readTime || "5 min read"}</span>
                    </div>
                  </div>
                </div>
                <div className="sm:ml-auto flex space-x-2">
                  <SocialShare url={postUrl} title={post.title} description={post.excerpt} />
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`rounded-full ${isBookmarked ? "text-yellow-400 hover:text-yellow-500" : "text-white hover:bg-white/20"}`}
                    onClick={handleBookmark}
                  >
                    <Bookmark className="h-5 w-5" fill={isBookmarked ? "currentColor" : "none"} />
                    <span className="sr-only">{isBookmarked ? "Remove Bookmark" : "Bookmark"}</span>
                  </Button>
                  <BlockchainVerification
                    contentId={post._id}
                    timestamp={post.createdAt}
                    author={`${post.author.firstName} ${post.author.lastName}`}
                  />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container mx-auto px-4 md:px-6 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-2/3">
              {/* Article Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {isPremium && !hasSubscription ? (
                  <PremiumContent
                    contentId={post._id}
                    title={post.title}
                    price={post.price || 2.99}
                    currency={post.currency || "USD"}
                    previewLines={5}
                  >
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                  </PremiumContent>
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                )}
              </div>

              {/* In-content sponsored content (only if no ad-free subscription) */}
              {!hasAdFreeAccess && (
                <div className="my-8 border-t border-b border-gray-200 dark:border-gray-800 py-6">
                  <SponsoredSection
                    placement="in-content"
                    title="Recommended for you"
                    limit={1}
                    variant="compact"
                    categories={[post.category]}
                  />
                </div>
              )}

              {/* Tags */}
              <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
                <div className="flex flex-wrap gap-2">
                  <span className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full">
                    {post.category}
                  </span>
                  {post.tags &&
                    post.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
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
                    <p className="text-gray-600 dark:text-gray-300 mt-1">{post.author.bio || "Writer at OriokieX"}</p>
                  </div>
                </div>
              </div>

              {/* Newsletter Subscription */}
              <div className="mt-12">
                <NewsletterSubscription />
              </div>

              {/* Comments Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Comments</h3>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-8">
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="min-h-[100px] mb-4"
                  />
                  <Button
                    type="submit"
                    className="flex items-center gap-2"
                    disabled={!commentText.trim() || submittingComment}
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                    <Send className="h-4 w-4" />
                  </Button>
                </form>

                {/* Display comments */}
                {comments && comments.length > 0 ? (
                  <div className="mt-6 space-y-6">
                    {comments.map((comment) => (
                      <div key={comment._id} className="p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                        <div className="flex items-start">
                          <div className="relative h-10 w-10 rounded-full overflow-hidden mr-4">
                            <Image
                              src={comment.user?.avatar || "/placeholder.svg"}
                              alt={comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : "Anonymous"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center">
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {comment.user ? `${comment.user.firstName} ${comment.user.lastName}` : "Anonymous"}
                              </h4>
                              <span className="mx-2 text-gray-400">•</span>
                              <time className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                              </time>
                            </div>
                            <p className="mt-2 text-gray-600 dark:text-gray-300">{comment.content}</p>
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

            {/* Sidebar */}
            <div className="lg:w-1/3">
              {/* Subscription CTA */}
              {!hasSubscription && (
                <div className="mb-8 sticky top-24 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                  <h3 className="text-xl font-bold mb-2">Enjoy Premium Content</h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Subscribe to our premium plan and enjoy unlimited access to premium content plus an ad-free
                    experience.
                  </p>
                  <Button className="w-full" asChild>
                    <Link href="/subscription">Subscribe Now</Link>
                  </Button>
                </div>
              )}

              {/* Sponsored content in sidebar (only if no ad-free subscription) */}
              {!hasAdFreeAccess && (
                <div className="mb-8 sticky top-80">
                  <SponsoredSection
                    placement="sidebar"
                    title="Sponsored"
                    limit={2}
                    variant="sidebar"
                    categories={[post.category]}
                  />
                </div>
              )}

              {/* More from author */}
              <div className="sticky top-24">
                <h3 className="text-xl font-bold mb-4">More from {post.author.firstName}</h3>
                <div className="space-y-4">
                  {/* This would be populated with more posts from the same author */}
                  <div className="p-4 border border-gray-200 dark:border-gray-800 rounded-lg">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Loading more articles...</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Recommendations */}
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
          <div className="container mx-auto px-4 md:px-6">
            <ContentRecommendations currentPostId={post._id} />
          </div>
        </div>

        {/* Sponsored content at the bottom (only if no ad-free subscription) */}
        {!hasAdFreeAccess && (
          <div className="container mx-auto px-4 md:px-6 py-8">
            <SponsoredSection placement="homepage" title="You might also like" limit={3} variant="default" />
          </div>
        )}
      </article>
    </>
  )
} 