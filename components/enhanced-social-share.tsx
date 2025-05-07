"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Facebook, Twitter, Linkedin, Copy, Check, Share2, Mail, Bookmark, BookmarkCheck } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { bookmarkAPI } from "@/lib/api"

interface EnhancedSocialShareProps {
  url: string
  title: string
  description?: string
  postId?: string
  className?: string
  compact?: boolean
}

export function EnhancedSocialShare({
  url,
  title,
  description = "",
  postId,
  className = "",
  compact = false,
}: EnhancedSocialShareProps) {
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()
  const [copied, setCopied] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [shareCount, setShareCount] = useState(0)

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedDescription = encodeURIComponent(description)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      incrementShareCount()
      toast({
        title: "Link copied",
        description: "The link has been copied to your clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
      toast({
        title: "Failed to copy",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleShare = (platform: string) => {
    window.open(shareLinks[platform as keyof typeof shareLinks], "_blank")
    incrementShareCount()
  }

  const incrementShareCount = () => {
    setShareCount((prev) => prev + 1)
    // In a real implementation, you would send this to your backend
    // to track share analytics
  }

  const toggleBookmark = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to bookmark this post",
        variant: "destructive",
      })
      return
    }

    if (!postId) return

    try {
      if (isBookmarked) {
        await bookmarkAPI.removeBookmark(postId)
        setIsBookmarked(false)
        toast({
          title: "Removed from bookmarks",
          description: "This post has been removed from your bookmarks",
        })
      } else {
        await bookmarkAPI.addBookmark(postId)
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

  if (compact) {
    return (
      <div className={`flex items-center ${className}`}>
        <TooltipProvider>
          <DropdownMenu>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Share2 className="h-4 w-4" />
                    <span className="sr-only">Share options</span>
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>Share</TooltipContent>
            </Tooltip>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleShare("twitter")}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("facebook")}>
                <Facebook className="h-4 w-4 mr-2" />
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("linkedin")}>
                <Linkedin className="h-4 w-4 mr-2" />
                LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShare("email")}>
                <Mail className="h-4 w-4 mr-2" />
                Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopyLink}>
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                Copy link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {postId && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleBookmark} className="rounded-full">
                  {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                  <span className="sr-only">{isBookmarked ? "Remove bookmark" : "Bookmark"}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>{isBookmarked ? "Remove bookmark" : "Bookmark"}</TooltipContent>
            </Tooltip>
          )}
        </TooltipProvider>
      </div>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => handleShare("twitter")} className="rounded-full">
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Share on Twitter</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Twitter</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => handleShare("facebook")} className="rounded-full">
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Share on Facebook</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on Facebook</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => handleShare("linkedin")} className="rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">Share on LinkedIn</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share on LinkedIn</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={() => handleShare("email")} className="rounded-full">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Share via Email</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Share via Email</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleCopyLink} className="rounded-full">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="sr-only">Copy link</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>{copied ? "Copied!" : "Copy link"}</TooltipContent>
        </Tooltip>

        {postId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleBookmark} className="rounded-full">
                {isBookmarked ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                <span className="sr-only">{isBookmarked ? "Remove bookmark" : "Bookmark"}</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>{isBookmarked ? "Remove bookmark" : "Bookmark"}</TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  )
}
