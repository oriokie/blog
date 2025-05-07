"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { bookmarkAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import { Bookmark, BookmarkX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import Image from "next/image"

interface BookmarkedPost {
  _id: string
  post: {
    _id: string
    title: string
    excerpt: string
    coverImage: string
    slug: string
    category: {
      name: string
    }
    author: {
      firstName: string
      lastName: string
      avatar: string
    }
    createdAt: string
  }
  createdAt: string
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchBookmarks()
  }, [])

  const fetchBookmarks = async () => {
    try {
      setLoading(true)
      const response = await bookmarkAPI.getBookmarks()
      setBookmarks(response.data)
    } catch (error) {
      console.error("Error fetching bookmarks:", error)
      toast({
        title: "Error",
        description: "Failed to load bookmarks. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRemoveBookmark = async (postId: string) => {
    try {
      await bookmarkAPI.removeBookmark(postId)
      setBookmarks(bookmarks.filter((bookmark) => bookmark.post._id !== postId))
      toast({
        title: "Bookmark removed",
        description: "The post has been removed from your bookmarks",
      })
    } catch (error) {
      console.error("Error removing bookmark:", error)
      toast({
        title: "Error",
        description: "Failed to remove bookmark. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Bookmarks</h2>
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Bookmark className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No bookmarks yet</h3>
          <p className="text-muted-foreground mb-6">When you bookmark posts, they'll appear here for easy access.</p>
          <Button asChild>
            <Link href="/blog">Browse articles</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bookmarks.map((bookmark) => (
            <Card key={bookmark._id} className="overflow-hidden flex flex-col h-full">
              <div className="relative h-48">
                <Image
                  src={bookmark.post.coverImage || "/placeholder.svg?height=200&width=400"}
                  alt={bookmark.post.title}
                  fill
                  className="object-cover"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-background/80 hover:bg-background/90 rounded-full"
                  onClick={() => handleRemoveBookmark(bookmark.post._id)}
                >
                  <BookmarkX className="h-4 w-4" />
                  <span className="sr-only">Remove bookmark</span>
                </Button>
                <div className="absolute bottom-2 left-2">
                  <span className="px-2 py-1 text-xs font-medium bg-black/70 text-white rounded">
                    {bookmark.post.category?.name || "Uncategorized"}
                  </span>
                </div>
              </div>
              <CardContent className="p-4 flex-1 flex flex-col">
                <Link href={`/blog/${bookmark.post.slug || bookmark.post._id}`}>
                  <h3 className="font-medium text-lg hover:underline line-clamp-2 mb-2">{bookmark.post.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{bookmark.post.excerpt}</p>
                <div className="flex items-center justify-between mt-auto pt-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="relative w-6 h-6 rounded-full overflow-hidden mr-2">
                      <Image
                        src={bookmark.post.author?.avatar || "/placeholder.svg?height=24&width=24"}
                        alt={`${bookmark.post.author?.firstName} ${bookmark.post.author?.lastName}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <span>
                      {bookmark.post.author?.firstName} {bookmark.post.author?.lastName}
                    </span>
                  </div>
                  <span>{new Date(bookmark.post.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
