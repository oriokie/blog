"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { UserPlus, UserMinus, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { followAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface FollowButtonProps {
  userId: string
  initialFollowState?: boolean
  size?: "default" | "sm" | "lg" | "icon"
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  className?: string
}

export function FollowButton({
  userId,
  initialFollowState = false,
  size = "default",
  variant = "outline",
  className = "",
}: FollowButtonProps) {
  const { user, isAuthenticated } = useAuth()
  const { toast } = useToast()
  const [isFollowing, setIsFollowing] = useState(initialFollowState)
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (isAuthenticated && user?._id !== userId) {
      checkFollowStatus()
    }
  }, [isAuthenticated, userId, user])

  const checkFollowStatus = async () => {
    try {
      const response = await followAPI.checkFollowStatus(userId)
      setIsFollowing(response.data.isFollowing)
      setIsInitialized(true)
    } catch (error) {
      console.error("Error checking follow status:", error)
      setIsInitialized(true)
    }
  }

  const handleFollowToggle = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to follow this author",
        variant: "destructive",
      })
      return
    }

    if (user?._id === userId) {
      toast({
        title: "Action not allowed",
        description: "You cannot follow yourself",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      if (isFollowing) {
        await followAPI.unfollowUser(userId)
        setIsFollowing(false)
        toast({
          title: "Unfollowed",
          description: "You are no longer following this author",
        })
      } else {
        await followAPI.followUser(userId)
        setIsFollowing(true)
        toast({
          title: "Following",
          description: "You are now following this author",
        })
      }
    } catch (error) {
      console.error("Error toggling follow status:", error)
      toast({
        title: "Error",
        description: "Failed to update follow status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!isInitialized && isAuthenticated && user?._id !== userId) {
    return (
      <Button variant="ghost" size="icon" className={className} disabled>
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }

  if (user?._id === userId) {
    return null
  }

  return (
    <Button
      variant={isFollowing ? "secondary" : variant}
      size={size}
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : isFollowing ? (
        <UserMinus className="h-4 w-4 mr-2" />
      ) : (
        <UserPlus className="h-4 w-4 mr-2" />
      )}
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
}
