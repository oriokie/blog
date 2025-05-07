"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Download, TrendingUp, Users, DollarSign, MousePointer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AffiliateAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  })
  const [activeTab, setActiveTab] = useState("overview")
  const [timeframe, setTimeframe] = useState("30days")
  const { toast } = useToast()

  // Mock data for the dashboard
  const [data, setData] = useState({
    overview: {
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      conversionRate: 0,
      clicksChart: [],
      revenueChart: [],
    },
    links: [],
    topReferrers: [],
    geoData: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // In a real app, this would be an API call with the date range
        // For demo purposes, we'll simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        const mockData = {
          overview: {
            totalClicks: 2547,
            totalConversions: 183,
            totalRevenue: 3692.45,
            conversionRate: 7.18,
            clicksChart: [
              { date: "2023-05-01", clicks: 65 },
              { date: "2023-05-02", clicks: 72 },
              { date: "2023-05-03", clicks: 89 },
              { date: "2023-05-04", clicks: 93 },
              { date: "2023-05-05", clicks: 78 },
              { date: "2023-05-06", clicks: 82 },
              { date: "2023-05-07", clicks: 91 },
              { date: "2023-05-08", clicks: 99 },
              { date: "2023-05-09", clicks: 87 },
              { date: "2023-05-10", clicks: 79 },
              { date: "2023-05-11", clicks: 83 },
              { date: "2023-05-12", clicks: 96 },
              { date: "2023-05-13", clicks: 88 },
              { date: "2023-05-14", clicks: 92 },
              { date: "2023-05-15", clicks: 85 },
            ],
            revenueChart: [
              { date: "2023-05-01", revenue: 98.45 },
              { date: "2023-05-02", revenue: 112.3 },
              { date: "2023-05-03", revenue: 145.75 },
              { date: "2023-05-04", revenue: 167.2 },
              { date: "2023-05-05", revenue: 132.5 },
              { date: "2023-05-06", revenue: 128.9 },
              { date: "2023-05-07", revenue: 156.4 },
              { date: "2023-05-08", revenue: 178.65 },
              { date: "2023-05-09", revenue: 143.25 },
              { date: "2023-05-10", revenue: 124.8 },
              { date: "2023-05-11", revenue: 136.95 },
              { date: "2023-05-12", revenue: 172.3 },
              { date: "2023-05-13", revenue: 154.75 },
              { date: "2023-05-14", revenue: 168.2 },
              { date: "2023-05-15", revenue: 142.5 },
            ],
          },
          links: [
            {
              id: "1",
              name: "Premium WordPress Theme",
              url: "https://example.com/theme",
              clicks: 876,
              conversions: 68,
              revenue: 1224.0,
              conversionRate: 7.76,
            },
            {
              id: "2",
              name: "SEO Tool Subscription",
              url: "https://example.com/seo",
              clicks: 654,
              conversions: 42,
              revenue: 882.0,
              conversionRate: 6.42,
            },
            {
              id: "3",
              name: "Web Hosting Service",
              url: "https://example.com/hosting",
              clicks: 543,
              conversions: 39,
              revenue: 858.0,
              conversionRate: 7.18,
            },
            {
              id: "4",
              name: "Email Marketing Platform",
              url: "https://example.com/email",
              clicks: 474,
              conversions: 34,
              revenue: 728.45,
              conversionRate: 7.17,
            },
          ],
          topReferrers: [
            { source: "Blog Posts", clicks: 1245, conversions: 98 },
            { source: "Social Media", clicks: 687, conversions: 42 },
            { source: "Email Newsletter", clicks: 423, conversions: 31 },
            { source: "YouTube Videos", clicks: 192, conversions: 12 },
          ],
          geoData: [
            { country: "United States", clicks: 1245, conversions: 98, revenue: 1960.0 },
            { country: "United Kingdom", clicks: 432, conversions: 31, revenue: 620.0 },
            { country: "Canada", clicks: 321, conversions: 24, revenue: 480.0 },
            { country: "Australia", clicks: 287, conversions: 19, revenue: 380.0 },
            { country: "Germany", clicks: 262, conversions: 11, revenue: 252.45 },
          ],
        }

        setData(mockData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching affiliate data:", error)
        toast({
          title: "Error",
          description: "Failed to load affiliate analytics data",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchData()
  }, [dateRange, timeframe, toast])

  const handleTimeframeChange = (value) => {
    setTimeframe(value)
    const today = new Date()
    let fromDate

    switch (value) {
      case "7days":
        fromDate = new Date(today)
        fromDate.setDate(today.getDate() - 7)
        break
      case "30days":
        fromDate = new Date(today)
        fromDate.setDate(today.getDate() - 30)
        break
      case "90days":
        fromDate = new Date(today)
        fromDate.setDate(today.getDate() - 90)
        break
      case "year":
        fromDate = new Date(today)
        fromDate.setFullYear(today.getFullYear() - 1)
        break
      default:
        fromDate = new Date(today)
        fromDate.setDate(today.getDate() - 30)
    }

    setDateRange({
      from: fromDate,
      to: today,
    })
  }

  const handleExportData = () => {
    toast({
      title: "Export started",
      description: "Your data is being exported. It will be downloaded shortly.",
    })

    // In a real app, this would trigger an API call to generate a CSV/Excel file
    setTimeout(() => {
      toast({
        title: "Export complete",
        description: "Your data has been exported successfully.",
      })
    }, 2000)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center p-8">
          <p>Loading affiliate analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400">Track your affiliate marketing performance</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
          <Select value={timeframe} onValueChange={handleTimeframeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">Last year</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>

          {timeframe === "custom" && (
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "PPP") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[150px] justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.to ? format(dateRange.to, "PPP") : "To date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}

          <Button variant="outline" onClick={handleExportData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Affiliate Links</TabsTrigger>
          <TabsTrigger value="referrers">Top Referrers</TabsTrigger>
          <TabsTrigger value="geo">Geographic Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
                <MousePointer className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.totalClicks.toLocaleString()}</div>
                <p className="text-xs text-gray-500">+12.5% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Conversions</CardTitle>
                <Users className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.totalConversions.toLocaleString()}</div>
                <p className="text-xs text-gray-500">+8.2% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${data.overview.totalRevenue.toLocaleString()}</div>
                <p className="text-xs text-gray-500">+15.3% from previous period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-gray-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{data.overview.conversionRate.toFixed(2)}%</div>
                <p className="text-xs text-gray-500">+2.1% from previous period</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Clicks Over Time</CardTitle>
                <CardDescription>Daily click trends for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {/* In a real app, this would be a chart component */}
                  <div className="flex h-full items-end gap-2">
                    {data.overview.clicksChart.map((item, index) => (
                      <div key={index} className="relative flex-1">
                        <div
                          className="absolute bottom-0 w-full bg-blue-500 rounded-t"
                          style={{ height: `${(item.clicks / 100) * 100}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Revenue Over Time</CardTitle>
                <CardDescription>Daily revenue trends for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {/* In a real app, this would be a chart component */}
                  <div className="flex h-full items-end gap-2">
                    {data.overview.revenueChart.map((item, index) => (
                      <div key={index} className="relative flex-1">
                        <div
                          className="absolute bottom-0 w-full bg-green-500 rounded-t"
                          style={{ height: `${(item.revenue / 200) * 100}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="links">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Links Performance</CardTitle>
              <CardDescription>Detailed performance metrics for each affiliate link</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Link Name</th>
                      <th className="text-left py-3 px-4">Clicks</th>
                      <th className="text-left py-3 px-4">Conversions</th>
                      <th className="text-left py-3 px-4">Revenue</th>
                      <th className="text-left py-3 px-4">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.links.map((link) => (
                      <tr key={link.id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="font-medium">{link.name}</div>
                          <div className="text-xs text-gray-500 truncate max-w-[200px]">{link.url}</div>
                        </td>
                        <td className="py-3 px-4">{link.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4">{link.conversions.toLocaleString()}</td>
                        <td className="py-3 px-4">${link.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">{link.conversionRate.toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Sources driving traffic to your affiliate links</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Source</th>
                      <th className="text-left py-3 px-4">Clicks</th>
                      <th className="text-left py-3 px-4">Conversions</th>
                      <th className="text-left py-3 px-4">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topReferrers.map((referrer, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <div className="font-medium">{referrer.source}</div>
                        </td>
                        <td className="py-3 px-4">{referrer.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4">{referrer.conversions.toLocaleString()}</td>
                        <td className="py-3 px-4">{((referrer.conversions / referrer.clicks) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geo">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Performance</CardTitle>
              <CardDescription>Affiliate performance by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Country</th>
                      <th className="text-left py-3 px-4">Clicks</th>
                      <th className="text-left py-3 px-4">Conversions</th>
                      <th className="text-left py-3 px-4">Revenue</th>
                      <th className="text-left py-3 px-4">Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.geoData.map((country, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3 px-4">
                          <div className="font-medium">{country.country}</div>
                        </td>
                        <td className="py-3 px-4">{country.clicks.toLocaleString()}</td>
                        <td className="py-3 px-4">{country.conversions.toLocaleString()}</td>
                        <td className="py-3 px-4">${country.revenue.toLocaleString()}</td>
                        <td className="py-3 px-4">{((country.conversions / country.clicks) * 100).toFixed(2)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
