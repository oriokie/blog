"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart3,
  LineChart,
  PieChart,
  FileText,
  Eye,
  MessageSquare,
  ThumbsUp,
  PlusCircle,
  ImagePlus,
} from "lucide-react"
import { analyticsAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.getDashboardStats()
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your content.</p>
        </div>
      </div>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
          <TabsTrigger value="overview" className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary">
            <LineChart className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2 rounded-none border-b-2 border-transparent px-4 py-2 data-[state=active]:border-primary">
            <PieChart className="h-4 w-4" />
            Engagement
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats?.totalPosts || 0}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <>
                      {stats?.totalPublished || 0} published, {stats?.totalDrafts || 0} drafts
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats?.totalViews || 0}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? <Skeleton className="h-4 w-32 mt-1" /> : "Lifetime article views"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Comments</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats?.totalComments || 0}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? <Skeleton className="h-4 w-32 mt-1" /> : "Total comments received"}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Likes</CardTitle>
                <ThumbsUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats?.totalLikes || 0}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? <Skeleton className="h-4 w-32 mt-1" /> : "Total article likes"}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent posts and their performance</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {stats?.recentPosts?.length > 0 ? (
                      stats.recentPosts.map((post: any) => (
                        <div key={post._id} className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">{post.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(post.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-sm text-muted-foreground">
                              {post.views} views
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {post.comments} comments
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No recent activity</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Overview</CardTitle>
              <CardDescription>Views over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Analytics chart will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="engagement" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
              <CardDescription>Comments and likes over time</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Engagement chart will be displayed here
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
