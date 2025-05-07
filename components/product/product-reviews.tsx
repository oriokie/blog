"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Star, ThumbsUp, ThumbsDown, AlertCircle } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/auth-context"

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState([])
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [userReview, setUserReview] = useState({
    rating: 5,
    title: "",
    content: "",
  })
  const { toast } = useToast()
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data
        const mockReviews = [
          {
            _id: "1",
            rating: 5,
            title: "Excellent product!",
            content:
              "This is exactly what I needed. The quality is outstanding and it has helped me tremendously with my projects.",
            createdAt: "2023-05-15T10:30:00Z",
            user: {
              _id: "user1",
              firstName: "John",
              lastName: "Doe",
              avatar: "",
            },
            helpfulVotes: 12,
            unhelpfulVotes: 2,
            verified: true,
          },
          {
            _id: "2",
            rating: 4,
            title: "Very good, but could be better",
            content:
              "I'm quite satisfied with this product. It has most of the features I need, but there are a few improvements that could be made.",
            createdAt: "2023-05-10T14:20:00Z",
            user: {
              _id: "user2",
              firstName: "Jane",
              lastName: "Smith",
              avatar: "",
            },
            helpfulVotes: 8,
            unhelpfulVotes: 1,
            verified: true,
          },
          {
            _id: "3",
            rating: 3,
            title: "Decent, but overpriced",
            content:
              "The product is okay, but I think it's a bit overpriced for what it offers. There are cheaper alternatives that provide similar functionality.",
            createdAt: "2023-05-05T09:15:00Z",
            user: {
              _id: "user3",
              firstName: "Robert",
              lastName: "Johnson",
              avatar: "",
            },
            helpfulVotes: 5,
            unhelpfulVotes: 3,
            verified: false,
          },
        ]

        const mockStats = {
          totalReviews: 15,
          averageRating: 4.2,
          ratingDistribution: {
            5: 8,
            4: 4,
            3: 2,
            2: 1,
            1: 0,
          },
        }

        setReviews(mockReviews)
        setStats(mockStats)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching reviews:", error)
        toast({
          title: "Error",
          description: "Failed to load reviews",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchReviews()
  }, [toast])

  const handleRatingChange = (rating) => {
    setUserReview((prev) => ({ ...prev, rating }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setUserReview((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create a new review object
      const newReview = {
        _id: `temp-${Date.now()}`,
        ...userReview,
        createdAt: new Date().toISOString(),
        user: {
          _id: user?._id || "current-user",
          firstName: user?.firstName || "Current",
          lastName: user?.lastName || "User",
          avatar: user?.avatar || "",
        },
        helpfulVotes: 0,
        unhelpfulVotes: 0,
        verified: true, // Assuming the user has purchased the product
      }

      // Add the new review to the list
      setReviews((prev) => [newReview, ...prev])

      // Update stats (simplified)
      setStats((prev) => ({
        ...prev,
        totalReviews: prev.totalReviews + 1,
        averageRating: (prev.averageRating * prev.totalReviews + userReview.rating) / (prev.totalReviews + 1),
        ratingDistribution: {
          ...prev.ratingDistribution,
          [userReview.rating]: prev.ratingDistribution[userReview.rating] + 1,
        },
      }))

      // Reset form
      setUserReview({
        rating: 5,
        title: "",
        content: "",
      })
      setShowReviewForm(false)

      toast({
        title: "Review submitted",
        description: "Your review has been submitted successfully and is pending approval.",
      })
    } catch (error) {
      console.error("Error submitting review:", error)
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleVote = async (reviewId, helpful) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to vote on reviews",
        variant: "destructive",
      })
      return
    }

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll update the state directly
      setReviews((prev) =>
        prev.map((review) => {
          if (review._id === reviewId) {
            // Check if user has already voted
            const hasVoted = review.userVote !== undefined

            if (hasVoted && review.userVote === helpful) {
              // Remove vote
              return {
                ...review,
                helpfulVotes: helpful ? review.helpfulVotes - 1 : review.helpfulVotes,
                unhelpfulVotes: helpful ? review.unhelpfulVotes : review.unhelpfulVotes - 1,
                userVote: undefined,
              }
            } else if (hasVoted) {
              // Change vote
              return {
                ...review,
                helpfulVotes: helpful ? review.helpfulVotes + 1 : review.helpfulVotes - 1,
                unhelpfulVotes: helpful ? review.unhelpfulVotes - 1 : review.unhelpfulVotes + 1,
                userVote: helpful,
              }
            } else {
              // New vote
              return {
                ...review,
                helpfulVotes: helpful ? review.helpfulVotes + 1 : review.helpfulVotes,
                unhelpfulVotes: helpful ? review.unhelpfulVotes : review.unhelpfulVotes + 1,
                userVote: helpful,
              }
            }
          }
          return review
        }),
      )
    } catch (error) {
      console.error("Error voting on review:", error)
      toast({
        title: "Error",
        description: "Failed to register your vote",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="py-6">
        <p className="text-center text-gray-500">Loading reviews...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Rating summary */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
            <CardDescription>
              {stats.totalReviews} {stats.totalReviews === 1 ? "review" : "reviews"} with an average of{" "}
              {stats.averageRating.toFixed(1)} out of 5 stars
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="text-4xl font-bold mr-2">{stats.averageRating.toFixed(1)}</div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(stats.averageRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center">
                  <div className="w-12 text-sm">{rating} star</div>
                  <Progress
                    value={(stats.ratingDistribution[rating] / stats.totalReviews) * 100}
                    className="h-2 flex-1 mx-2"
                  />
                  <div className="w-12 text-sm text-right">
                    {stats.ratingDistribution[rating]} (
                    {Math.round((stats.ratingDistribution[rating] / stats.totalReviews) * 100)}%)
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            {isAuthenticated ? (
              <Button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="w-full"
                variant={showReviewForm ? "outline" : "default"}
              >
                {showReviewForm ? "Cancel" : "Write a Review"}
              </Button>
            ) : (
              <Button onClick={() => toast({ title: "Please log in to write a review" })} className="w-full">
                Log in to Write a Review
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>

      {/* Review form */}
      {showReviewForm && (
        <Card>
          <CardHeader>
            <CardTitle>Write a Review</CardTitle>
            <CardDescription>Share your experience with this product</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-8 w-8 cursor-pointer ${
                        star <= userReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                      }`}
                      onClick={() => handleRatingChange(star)}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">Review Title</Label>
                <Input
                  id="title"
                  name="title"
                  value={userReview.title}
                  onChange={handleInputChange}
                  placeholder="Summarize your experience"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Review Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={userReview.content}
                  onChange={handleInputChange}
                  placeholder="Share details of your experience with this product"
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews list */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
        ) : (
          reviews.map((review) => (
            <Card key={review._id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <Avatar className="h-8 w-8 mr-2">
                      <AvatarImage
                        src={review.user.avatar || ""}
                        alt={`${review.user.firstName} ${review.user.lastName}`}
                      />
                      <AvatarFallback>
                        {review.user.firstName.charAt(0)}
                        {review.user.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">
                        {review.user.firstName} {review.user.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                        {review.verified && (
                          <span className="ml-2 text-green-600 flex items-center text-xs">
                            <AlertCircle className="h-3 w-3 mr-1" /> Verified Purchase
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <CardTitle className="text-base mt-2">{review.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-sm">{review.content}</p>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-4">Was this review helpful?</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center ${review.userVote === true ? "text-green-600" : ""}`}
                    onClick={() => handleVote(review._id, true)}
                  >
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {review.helpfulVotes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`flex items-center ${review.userVote === false ? "text-red-600" : ""}`}
                    onClick={() => handleVote(review._id, false)}
                  >
                    <ThumbsDown className="h-4 w-4 mr-1" />
                    {review.unhelpfulVotes}
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
