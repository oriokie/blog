"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, BookOpen, Clock, LineChart, ListFilter, PieChart, BookmarkCheck, History } from "lucide-react"
import { analyticsAPI } from "@/lib/api"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Line,
  LineChart as RechartsLineChart,
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  Pie,
  PieChart as RechartsPieChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function ReadingStatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.getReadingStats()
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching reading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Sample data for demonstration
  const readingHistoryData = [
    { date: "Mon", minutes: 25 },
    { date: "Tue", minutes: 40 },
    { date: "Wed", minutes: 15 },
    { date: "Thu", minutes: 30 },
    { date: "Fri", minutes: 45 },
    { date: "Sat", minutes: 60 },
    { date: "Sun", minutes: 35 },
  ]

  const topicDistributionData = [
    { name: "Technology", value: 35 },
    { name: "Business", value: 25 },
    { name: "Science", value: 15 },
    { name: "Health", value: 10 },
    { name: "Other", value: 15 },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

  const authorDistributionData = [
    { name: "Author A", articles: 12 },
    { name: "Author B", articles: 8 },
    { name: "Author C", articles: 5 },
    { name: "Author D", articles: 4 },
    { name: "Others", articles: 10 },
  ]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Reading Stats</h2>
        <Button variant="outline" asChild>
          <Link href="/dashboard/bookmarks">
            <BookmarkCheck className="mr-2 h-4 w-4" />
            View Bookmarks
          </Link>
        </Button>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Reading History
          </TabsTrigger>
          <TabsTrigger value="topics" className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            Topics
          </TabsTrigger>
          <TabsTrigger value="authors" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Authors
          </TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Articles Read</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats?.articlesRead || 42}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <>+{stats?.articlesReadThisWeek || 5} from last week</>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats?.totalReadingMinutes || 250} min</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <>Avg {stats?.avgReadingMinutesPerDay || 36} min/day</>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats?.completionRate || 78}%</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? (
                    <Skeleton className="h-4 w-32 mt-1" />
                  ) : (
                    <>+{stats?.completionRateChange || 3}% from last month</>
                  )}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Bookmarks</CardTitle>
                <BookmarkCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                {loading ? (
                  <Skeleton className="h-7 w-20" />
                ) : (
                  <div className="text-2xl font-bold">{stats?.bookmarksCount || 17}</div>
                )}
                <p className="text-xs text-muted-foreground">
                  {loading ? <Skeleton className="h-4 w-32 mt-1" /> : <>{stats?.bookmarksReadCount || 12} read</>}
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Reading Activity</CardTitle>
                <CardDescription>Your daily reading minutes over the past week</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <ChartContainer
                    config={{
                      minutes: {
                        label: "Reading Minutes",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsLineChart data={readingHistoryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line
                          type="monotone"
                          dataKey="minutes"
                          stroke="var(--color-minutes)"
                          strokeWidth={2}
                          activeDot={{ r: 8 }}
                        />
                      </RechartsLineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Topic Distribution</CardTitle>
                <CardDescription>What you've been reading about</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Skeleton className="h-full w-full" />
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={topicDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {topicDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Reading History</CardTitle>
              <CardDescription>Articles you've read recently</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-16 w-full" />
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {stats?.recentlyRead?.length > 0 ? (
                    stats.recentlyRead.map((article: any) => (
                      <div key={article._id} className="flex items-start space-x-4 border-b pb-4">
                        <div className="w-12 h-12 rounded-md bg-muted flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium">{article.title}</h4>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <span>{article.author}</span>
                            <span className="mx-2">•</span>
                            <span>{article.readDate}</span>
                            <span className="mx-2">•</span>
                            <span>{article.readingTime} min read</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium">{article.completionRate}% read</div>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No reading history found.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="topics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Topics You Follow</CardTitle>
              <CardDescription>Categories and tags you're interested in</CardDescription>
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
                  {stats?.followedTopics?.length > 0 ? (
                    stats.followedTopics.map((topic: any) => (
                      <div key={topic.id} className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <ListFilter className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{topic.name}</h4>
                            <p className="text-sm text-muted-foreground">{topic.articlesCount} articles</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Unfollow
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground">You're not following any topics yet.</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="authors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Authors You Read</CardTitle>
              <CardDescription>Distribution of authors in your reading history</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Skeleton className="h-full w-full" />
                </div>
              ) : (
                <ChartContainer
                  config={{
                    articles: {
                      label: "Articles Read",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={authorDistributionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="articles" fill="var(--color-articles)" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
