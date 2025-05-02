"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { TrendingUp, Users, Eye, ThumbsUp, MessageSquare, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { dashboardAPI } from "@/lib/api"

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    totalSubscribers: 0,
  })
  const [viewsData, setViewsData] = useState([])
  const [engagementData, setEngagementData] = useState([])
  const [recentPosts, setRecentPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const [statsRes, viewsRes, engagementRes, postsRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getViewsData(),
          dashboardAPI.getEngagementData(),
          dashboardAPI.getRecentPosts(),
        ])

        setStats(statsRes.data)
        setViewsData(viewsRes.data)
        setEngagementData(engagementRes.data)
        setRecentPosts(postsRes.data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard</h2>
        <Link href="/dashboard/posts/new">
          <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white">
            <Plus className="h-4 w-4 mr-2" />
            New Post
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalViews.toLocaleString()}
              </div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                12% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Likes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalLikes.toLocaleString()}
              </div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                8% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</CardTitle>
              <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalComments.toLocaleString()}
              </div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                5% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 dark:text-gray-400">Subscribers</CardTitle>
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.totalSubscribers.toLocaleString()}
              </div>
              <p className="text-xs text-green-500 flex items-center mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                18% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Page Views</CardTitle>
              <CardDescription>Daily page views over the last 7 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  views: {
                    label: "Views",
                    color: "hsl(var(--chart-1))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={viewsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Engagement</CardTitle>
              <CardDescription>Likes and comments over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  likes: {
                    label: "Likes",
                    color: "hsl(var(--chart-1))",
                  },
                  comments: {
                    label: "Comments",
                    color: "hsl(var(--chart-2))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={engagementData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} dot={{ r: 4 }} />
                    <Line
                      type="monotone"
                      dataKey="comments"
                      stroke="var(--color-comments)"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Posts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Posts</CardTitle>
              <CardDescription>Your most recent blog posts</CardDescription>
            </div>
            <Link href="/dashboard/posts">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="text-left font-medium text-gray-500 dark:text-gray-400 pb-3">Title</th>
                    <th className="text-center font-medium text-gray-500 dark:text-gray-400 pb-3">Views</th>
                    <th className="text-center font-medium text-gray-500 dark:text-gray-400 pb-3">Likes</th>
                    <th className="text-center font-medium text-gray-500 dark:text-gray-400 pb-3">Comments</th>
                    <th className="text-right font-medium text-gray-500 dark:text-gray-400 pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPosts.map((post) => (
                    <tr
                      key={post._id}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      <td className="py-3">
                        <Link
                          href={`/dashboard/posts/${post._id}`}
                          className="font-medium text-gray-900 dark:text-white hover:underline"
                        >
                          {post.title}
                        </Link>
                      </td>
                      <td className="text-center text-gray-600 dark:text-gray-300 py-3">{post.views}</td>
                      <td className="text-center text-gray-600 dark:text-gray-300 py-3">{post.likes}</td>
                      <td className="text-center text-gray-600 dark:text-gray-300 py-3">{post.comments.length}</td>
                      <td className="text-right py-3">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/dashboard/posts/${post._id}/edit`}>
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
