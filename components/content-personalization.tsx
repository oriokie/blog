"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Clock, TrendingUp, History } from "lucide-react"

interface ContentPersonalizationProps {
  onPreferenceChange?: (preferences: any) => void
}

export default function ContentPersonalization({ onPreferenceChange }: ContentPersonalizationProps) {
  const [preferences, setPreferences] = useState({
    topics: {
      technology: true,
      business: false,
      design: true,
      marketing: false,
      lifestyle: false,
    },
    contentTypes: {
      articles: true,
      tutorials: true,
      caseStudies: false,
      videos: false,
      podcasts: false,
    },
    readingTime: {
      short: true, // < 5 min
      medium: true, // 5-15 min
      long: false, // > 15 min
    },
    recommendations: {
      enablePersonalized: true,
      enableTrending: true,
      enableSimilar: true,
    },
  })
  const [readingHistory, setReadingHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock reading history
        const mockHistory = [
          {
            id: "1",
            title: "10 Essential Web Development Tools for 2023",
            category: "technology",
            readAt: "2023-05-15T10:30:00Z",
            readingTime: 8,
          },
          {
            id: "2",
            title: "How to Design an Effective Landing Page",
            category: "design",
            readAt: "2023-05-14T14:20:00Z",
            readingTime: 12,
          },
          {
            id: "3",
            title: "Understanding React Server Components",
            category: "technology",
            readAt: "2023-05-13T09:15:00Z",
            readingTime: 15,
          },
          {
            id: "4",
            title: "Color Theory Basics for Web Designers",
            category: "design",
            readAt: "2023-05-12T16:45:00Z",
            readingTime: 6,
          },
          {
            id: "5",
            title: "Optimizing Database Queries for Better Performance",
            category: "technology",
            readAt: "2023-05-11T11:30:00Z",
            readingTime: 10,
          },
        ]

        setReadingHistory(mockHistory)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching preferences:", error)
        toast({
          title: "Error",
          description: "Failed to load your content preferences",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    if (isAuthenticated) {
      fetchPreferences()
    } else {
      setIsLoading(false)
    }
  }, [isAuthenticated, toast])

  const handlePreferenceChange = (category, key, value) => {
    setPreferences((prev) => {
      const newPreferences = {
        ...prev,
        [category]: {
          ...prev[category],
          [key]: value,
        },
      }

      // Notify parent component if callback is provided
      if (onPreferenceChange) {
        onPreferenceChange(newPreferences)
      }

      return newPreferences
    })
  }

  const handleSavePreferences = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Preferences saved",
        description: "Your content preferences have been updated successfully",
      })
    } catch (error) {
      console.error("Error saving preferences:", error)
      toast({
        title: "Error",
        description: "Failed to save your content preferences",
        variant: "destructive",
      })
    }
  }

  const getCategoryReadingStats = () => {
    const stats = {}
    readingHistory.forEach((item) => {
      if (!stats[item.category]) {
        stats[item.category] = 0
      }
      stats[item.category]++
    })
    return stats
  }

  const getReadingTimeStats = () => {
    const stats = {
      short: 0, // < 5 min
      medium: 0, // 5-15 min
      long: 0, // > 15 min
    }

    readingHistory.forEach((item) => {
      if (item.readingTime < 5) {
        stats.short++
      } else if (item.readingTime <= 15) {
        stats.medium++
      } else {
        stats.long++
      }
    })

    return stats
  }

  if (!isAuthenticated) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Personalization</CardTitle>
          <CardDescription>Sign in to personalize your content experience</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center py-4">
            Please sign in to access personalized content recommendations and preferences.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button>Sign In</Button>
        </CardFooter>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Content Personalization</CardTitle>
          <CardDescription>Loading your preferences...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-4">
            <p>Loading your content preferences...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Personalization</CardTitle>
        <CardDescription>Customize your content experience</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="preferences">
          <TabsList className="mb-4">
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="insights">Reading Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Topics of Interest</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(preferences.topics).map(([topic, enabled]) => (
                  <div key={topic} className="flex items-center justify-between">
                    <Label htmlFor={`topic-${topic}`} className="capitalize">
                      {topic}
                    </Label>
                    <Switch
                      id={`topic-${topic}`}
                      checked={enabled}
                      onCheckedChange={(checked) => handlePreferenceChange("topics", topic, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Content Types</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(preferences.contentTypes).map(([type, enabled]) => (
                  <div key={type} className="flex items-center justify-between">
                    <Label htmlFor={`type-${type}`} className="capitalize">
                      {type === "caseStudies" ? "Case Studies" : type}
                    </Label>
                    <Switch
                      id={`type-${type}`}
                      checked={enabled}
                      onCheckedChange={(checked) => handlePreferenceChange("contentTypes", type, checked)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Reading Time</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="time-short">Short (&lt; 5 min)</Label>
                  <Switch
                    id="time-short"
                    checked={preferences.readingTime.short}
                    onCheckedChange={(checked) => handlePreferenceChange("readingTime", "short", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="time-medium">Medium (5-15 min)</Label>
                  <Switch
                    id="time-medium"
                    checked={preferences.readingTime.medium}
                    onCheckedChange={(checked) => handlePreferenceChange("readingTime", "medium", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="time-long">Long (&gt; 15 min)</Label>
                  <Switch
                    id="time-long"
                    checked={preferences.readingTime.long}
                    onCheckedChange={(checked) => handlePreferenceChange("readingTime", "long", checked)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">Recommendations</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rec-personalized">Personalized Recommendations</Label>
                    <p className="text-sm text-gray-500">Based on your reading history and preferences</p>
                  </div>
                  <Switch
                    id="rec-personalized"
                    checked={preferences.recommendations.enablePersonalized}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("recommendations", "enablePersonalized", checked)
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rec-trending">Trending Content</Label>
                    <p className="text-sm text-gray-500">Popular content among other readers</p>
                  </div>
                  <Switch
                    id="rec-trending"
                    checked={preferences.recommendations.enableTrending}
                    onCheckedChange={(checked) => handlePreferenceChange("recommendations", "enableTrending", checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="rec-similar">Similar Content</Label>
                    <p className="text-sm text-gray-500">Content similar to what you're currently reading</p>
                  </div>
                  <Switch
                    id="rec-similar"
                    checked={preferences.recommendations.enableSimilar}
                    onCheckedChange={(checked) => handlePreferenceChange("recommendations", "enableSimilar", checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Your Reading Patterns</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Top Categories
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(getCategoryReadingStats())
                        .sort((a, b) => b[1] - a[1])
                        .map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="capitalize">{category}</span>
                            <span className="text-sm text-gray-500">{count} articles</span>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Reading Time Preference
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Object.entries(getReadingTimeStats()).map(([length, count]) => (
                        <div key={length} className="flex justify-between items-center">
                          <span className="capitalize">
                            {length === "short"
                              ? "Short (< 5 min)"
                              : length === "medium"
                                ? "Medium (5-15 min)"
                                : "Long (> 15 min)"}
                          </span>
                          <span className="text-sm text-gray-500">{count} articles</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Reading Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-2">
                      <div className="text-3xl font-bold">{readingHistory.length}</div>
                      <div className="text-sm text-gray-500">Articles in the last 30 days</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Recent Reading History</h3>
              <div className="space-y-4">
                {readingHistory.map((item) => (
                  <div key={item.id} className="flex items-start border-b pb-4">
                    <History className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0 text-gray-500" />
                    <div>
                      <div className="font-medium">{item.title}</div>
                      <div className="flex text-sm text-gray-500 mt-1">
                        <span className="capitalize mr-4">{item.category}</span>
                        <span className="mr-4">{item.readingTime} min read</span>
                        <span>{new Date(item.readAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSavePreferences}>Save Preferences</Button>
      </CardFooter>
    </Card>
  )
}
