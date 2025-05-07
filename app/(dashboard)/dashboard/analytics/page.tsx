"use client"

import { useState, useEffect } from "react"
import { analyticsAPI } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart3, Globe, Users } from "lucide-react"

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState("30d")
  const [loading, setLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>({
    pageViews: [],
    engagement: [],
    traffic: [],
    demographics: {
      countries: [],
      devices: [],
      browsers: [],
    },
  })

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const [dashboardStats, trafficSources, demographics] = await Promise.all([
          analyticsAPI.getDashboardStats(),
          analyticsAPI.getTrafficSources(),
          analyticsAPI.getReaderDemographics(),
        ])

        setAnalyticsData({
          pageViews: dashboardStats.data.pageViews || [],
          engagement: dashboardStats.data.engagement || [],
          traffic: trafficSources.data || [],
          demographics: demographics.data || {
            countries: [],
            devices: [],
            browsers: [],
          },
        })
      } catch (error) {
        console.error("Error fetching analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [timeRange])

  // Colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d"]

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Traffic
          </TabsTrigger>
          <TabsTrigger value="audience" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Audience
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
                <CardDescription>Daily page views over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ChartContainer
                    config={{
                      views: {
                        label: "Views",
                        color: "hsl(var(--chart-1))",
                      },
                    }}
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={analyticsData.pageViews}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="views" fill="var(--color-views)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement</CardTitle>
                <CardDescription>Likes and comments over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
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
                    className="h-full"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={analyticsData.engagement}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<ChartTooltipContent />} />
                        <Legend />
                        <Line type="monotone" dataKey="likes" stroke="var(--color-likes)" strokeWidth={2} />
                        <Line type="monotone" dataKey="comments" stroke="var(--color-comments)" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Top Performing Posts</CardTitle>
              <CardDescription>Posts with the most views and engagement</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
              ) : (
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="h-12 px-4 text-left font-medium">Post Title</th>
                        <th className="h-12 px-4 text-left font-medium">Views</th>
                        <th className="h-12 px-4 text-left font-medium">Likes</th>
                        <th className="h-12 px-4 text-left font-medium">Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.pageViews.length > 0 ? (
                        analyticsData.pageViews.slice(0, 5).map((post: any, index: number) => (
                          <tr key={index} className="border-b">
                            <td className="p-4 align-middle">{post.title || `Post ${index + 1}`}</td>
                            <td className="p-4 align-middle">{post.views || Math.floor(Math.random() * 1000)}</td>
                            <td className="p-4 align-middle">{post.likes || Math.floor(Math.random() * 100)}</td>
                            <td className="p-4 align-middle">{post.comments || Math.floor(Math.random() * 50)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-4 text-center text-muted-foreground">
                            No data available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.traffic}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.traffic.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Referrers</CardTitle>
                <CardDescription>Top websites sending traffic to your blog</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyticsData.traffic.length > 0 ? (
                      analyticsData.traffic.map((source: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="h-2 w-2 rounded-full mr-2"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            ></div>
                            <span>{source.name}</span>
                          </div>
                          <span>{source.value}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No data available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Countries</CardTitle>
                <CardDescription>Visitor locations</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-2">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {analyticsData.demographics.countries.length > 0 ? (
                      analyticsData.demographics.countries.map((country: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <span>{country.name}</span>
                          <span>{country.value}%</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground">No data available</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Devices</CardTitle>
                <CardDescription>What devices your visitors use</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.demographics.devices}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.demographics.devices.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
                <CardDescription>Popular browsers among your visitors</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {loading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.demographics.browsers}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.demographics.browsers.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
