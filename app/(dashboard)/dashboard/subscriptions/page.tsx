"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { BarChart, DollarSign, Users, Calendar, CreditCard, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { subscriptionAPI } from "@/lib/api"

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSubscriptions()
    fetchAnalytics()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      setIsLoading(true)
      const response = await subscriptionAPI.getAll()
      setSubscriptions(response.data)
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
      toast({
        title: "Error",
        description: "Failed to load subscriptions.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await subscriptionAPI.getAnalytics()
      setAnalytics(response.data)
    } catch (error) {
      console.error("Error fetching subscription analytics:", error)
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Subscriptions</h1>
        <Button>Export Data</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading || !analytics ? (
                <span className="animate-pulse">...</span>
              ) : (
                `$${analytics.revenue.total.toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Subscribers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading || !analytics ? <span className="animate-pulse">...</span> : analytics.counts.active}
            </div>
            <p className="text-xs text-muted-foreground">+10.5% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Recurring Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading || !analytics ? (
                <span className="animate-pulse">...</span>
              ) : (
                `$${analytics.revenue.monthly.toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">+5.2% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Recurring Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading || !analytics ? (
                <span className="animate-pulse">...</span>
              ) : (
                `$${analytics.revenue.yearly.toFixed(2)}`
              )}
            </div>
            <p className="text-xs text-muted-foreground">+12.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subscription Analytics</CardTitle>
          <CardDescription>Subscription metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <BarChart className="h-16 w-16 text-gray-300 dark:text-gray-600" />
            <p className="ml-4 text-gray-500 dark:text-gray-400">Subscription analytics chart will be displayed here</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Subscriptions</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="canceled">Canceled</TabsTrigger>
          <TabsTrigger value="expired">Expired</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All Subscriptions</CardTitle>
              <CardDescription>Manage all user subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
                </div>
              ) : subscriptions.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400">No subscriptions found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Payment Method</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subscriptions.map((subscription) => (
                      <TableRow key={subscription._id}>
                        <TableCell className="font-medium">
                          {subscription.user.firstName} {subscription.user.lastName}
                          <div className="text-xs text-gray-500">{subscription.user.email}</div>
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">{subscription.plan}</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {subscription.status === "active" ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500 mr-1" />
                            )}
                            <span
                              className={`capitalize ${
                                subscription.status === "active"
                                  ? "text-green-600"
                                  : subscription.status === "canceled"
                                    ? "text-red-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {subscription.status}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{format(new Date(subscription.startDate), "MMM d, yyyy")}</TableCell>
                        <TableCell>
                          {subscription.plan === "lifetime"
                            ? "Lifetime"
                            : format(new Date(subscription.endDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell>
                          <span className="capitalize">
                            {subscription.paymentMethod.replace("_", " ")}
                            {subscription.paymentMethod === "credit_card" &&
                              subscription.paymentDetails?.lastFour &&
                              ` (**** ${subscription.paymentDetails.lastFour})`}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="active" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Subscriptions</CardTitle>
              <CardDescription>Currently active subscriptions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table as above but filtered for active subscriptions */}
              <p className="text-center py-8 text-gray-500">Filter applied for active subscriptions</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="canceled" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Canceled Subscriptions</CardTitle>
              <CardDescription>Subscriptions that have been canceled</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table as above but filtered for canceled subscriptions */}
              <p className="text-center py-8 text-gray-500">Filter applied for canceled subscriptions</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="expired" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Expired Subscriptions</CardTitle>
              <CardDescription>Subscriptions that have expired</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar table as above but filtered for expired subscriptions */}
              <p className="text-center py-8 text-gray-500">Filter applied for expired subscriptions</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
