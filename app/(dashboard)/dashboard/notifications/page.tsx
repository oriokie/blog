"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Mail, AlertCircle, CheckCircle, XCircle, RefreshCw, Search } from "lucide-react"

export default function NotificationsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [notifications, setNotifications] = useState([])
  const [filter, setFilter] = useState({
    status: "",
    type: "",
    search: "",
  })
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
  })
  const [activeTab, setActiveTab] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll simulate loading
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Mock data
        const mockNotifications = [
          {
            _id: "1",
            type: "purchase_confirmation",
            recipient: {
              _id: "user1",
              firstName: "John",
              lastName: "Doe",
              email: "john.doe@example.com",
            },
            subject: "Your purchase of Premium WordPress Theme is confirmed",
            content: "<h1>Thank you for your purchase!</h1><p>We're excited to confirm your purchase...</p>",
            status: "sent",
            createdAt: "2023-05-15T10:30:00Z",
            sentAt: "2023-05-15T10:30:05Z",
          },
          {
            _id: "2",
            type: "affiliate_conversion",
            recipient: {
              _id: "user2",
              firstName: "Jane",
              lastName: "Smith",
              email: "jane.smith@example.com",
            },
            subject: "You've earned a commission!",
            content: "<h1>Congratulations!</h1><p>You've earned a commission of $45.00...</p>",
            status: "sent",
            createdAt: "2023-05-14T14:20:00Z",
            sentAt: "2023-05-14T14:20:03Z",
          },
          {
            _id: "3",
            type: "review_notification",
            recipient: {
              _id: "user3",
              firstName: "Robert",
              lastName: "Johnson",
              email: "robert.johnson@example.com",
            },
            subject: "New review on your product",
            content: "<h1>New Review</h1><p>Your product has received a new review...</p>",
            status: "failed",
            createdAt: "2023-05-13T09:15:00Z",
            error: "Recipient mailbox not found",
          },
          {
            _id: "4",
            type: "subscription_confirmation",
            recipient: {
              _id: "user4",
              firstName: "Emily",
              lastName: "Wilson",
              email: "emily.wilson@example.com",
            },
            subject: "Your Pro subscription is confirmed",
            content: "<h1>Subscription Confirmed</h1><p>Thank you for subscribing to our Pro plan...</p>",
            status: "pending",
            createdAt: "2023-05-12T16:45:00Z",
          },
          {
            _id: "5",
            type: "custom",
            recipient: {
              _id: "user5",
              firstName: "Michael",
              lastName: "Brown",
              email: "michael.brown@example.com",
            },
            subject: "Important update about your account",
            content: "<h1>Account Update</h1><p>We've made some important changes to your account...</p>",
            status: "sent",
            createdAt: "2023-05-11T11:30:00Z",
            sentAt: "2023-05-11T11:30:02Z",
          },
        ]

        setNotifications(mockNotifications)
        setPagination({
          page: 1,
          pages: 1,
          total: mockNotifications.length,
        })
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        toast({
          title: "Error",
          description: "Failed to load notifications",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchNotifications()
  }, [toast, filter, pagination.page, activeTab])

  const handleFilterChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }))
    setPagination((prev) => ({ ...prev, page: 1 }))
  }

  const handleResend = async (id) => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the notification in the list
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === id
            ? {
                ...notification,
                status: "sent",
                sentAt: new Date().toISOString(),
                error: null,
              }
            : notification,
        ),
      )

      toast({
        title: "Notification resent",
        description: "The notification has been resent successfully",
      })
    } catch (error) {
      console.error("Error resending notification:", error)
      toast({
        title: "Error",
        description: "Failed to resend notification",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case "sent":
        return <Badge className="bg-green-500">Sent</Badge>
      case "pending":
        return <Badge className="bg-yellow-500">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500">Failed</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case "purchase_confirmation":
        return "Purchase Confirmation"
      case "purchase_receipt":
        return "Purchase Receipt"
      case "affiliate_conversion":
        return "Affiliate Conversion"
      case "review_notification":
        return "Review Notification"
      case "subscription_confirmation":
        return "Subscription Confirmation"
      case "subscription_renewal":
        return "Subscription Renewal"
      case "subscription_cancellation":
        return "Subscription Cancellation"
      case "password_reset":
        return "Password Reset"
      case "welcome":
        return "Welcome"
      case "newsletter":
        return "Newsletter"
      case "custom":
        return "Custom"
      default:
        return type
    }
  }

  const filteredNotifications = notifications.filter((notification) => {
    // Filter by status
    if (filter.status && notification.status !== filter.status) {
      return false
    }

    // Filter by type
    if (filter.type && notification.type !== filter.type) {
      return false
    }

    // Filter by search term
    if (filter.search) {
      const searchTerm = filter.search.toLowerCase()
      const recipientName = `${notification.recipient.firstName} ${notification.recipient.lastName}`.toLowerCase()
      const recipientEmail = notification.recipient.email.toLowerCase()
      const subject = notification.subject.toLowerCase()

      return recipientName.includes(searchTerm) || recipientEmail.includes(searchTerm) || subject.includes(searchTerm)
    }

    return true
  })

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex justify-center p-8">
          <p>Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Email Notifications</h1>
        <p className="text-gray-500 dark:text-gray-400">Manage and monitor email notifications sent to users</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Notifications</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
          <TabsTrigger value="new">Send New</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View and manage all email notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input
                      placeholder="Search by recipient or subject"
                      className="pl-8"
                      value={filter.search}
                      onChange={(e) => handleFilterChange("search", e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <Select value={filter.status} onValueChange={(value) => handleFilterChange("status", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-full md:w-48">
                  <Select value={filter.type} onValueChange={(value) => handleFilterChange("type", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="purchase_confirmation">Purchase Confirmation</SelectItem>
                      <SelectItem value="affiliate_conversion">Affiliate Conversion</SelectItem>
                      <SelectItem value="review_notification">Review Notification</SelectItem>
                      <SelectItem value="subscription_confirmation">Subscription Confirmation</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {filteredNotifications.length === 0 ? (
                <div className="text-center py-8">
                  <Mail className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium">No notifications found</h3>
                  <p className="mt-1 text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4">Recipient</th>
                        <th className="text-left py-3 px-4">Type</th>
                        <th className="text-left py-3 px-4">Subject</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Date</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredNotifications.map((notification) => (
                        <tr key={notification._id} className="border-b">
                          <td className="py-3 px-4">
                            <div className="font-medium">
                              {notification.recipient.firstName} {notification.recipient.lastName}
                            </div>
                            <div className="text-xs text-gray-500">{notification.recipient.email}</div>
                          </td>
                          <td className="py-3 px-4">{getTypeLabel(notification.type)}</td>
                          <td className="py-3 px-4 max-w-[200px] truncate">{notification.subject}</td>
                          <td className="py-3 px-4">{getStatusBadge(notification.status)}</td>
                          <td className="py-3 px-4">
                            <div>{new Date(notification.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">
                              {new Date(notification.createdAt).toLocaleTimeString()}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            {notification.status === "failed" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleResend(notification._id)}
                                className="flex items-center"
                              >
                                <RefreshCw className="mr-1 h-4 w-4" />
                                Resend
                              </Button>
                            )}
                            {notification.status === "sent" && (
                              <Button size="sm" variant="outline" className="flex items-center">
                                <Mail className="mr-1 h-4 w-4" />
                                View
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {pagination.pages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    Showing {(pagination.page - 1) * 20 + 1} to {Math.min(pagination.page * 20, pagination.total)} of{" "}
                    {pagination.total} notifications
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sent Notifications</CardTitle>
              <CardDescription>View all successfully sent email notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar content to "all" tab but filtered for sent notifications */}
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-12 w-12 text-green-500" />
                <h3 className="mt-2 text-lg font-medium">Sent Notifications</h3>
                <p className="mt-1 text-gray-500">
                  {notifications.filter((n) => n.status === "sent").length} notifications sent successfully
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Notifications</CardTitle>
              <CardDescription>View notifications that are queued for delivery</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar content to "all" tab but filtered for pending notifications */}
              <div className="text-center py-8">
                <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                <h3 className="mt-2 text-lg font-medium">Pending Notifications</h3>
                <p className="mt-1 text-gray-500">
                  {notifications.filter((n) => n.status === "pending").length} notifications pending delivery
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Failed Notifications</CardTitle>
              <CardDescription>View and resend failed email notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Similar content to "all" tab but filtered for failed notifications */}
              <div className="text-center py-8">
                <XCircle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-2 text-lg font-medium">Failed Notifications</h3>
                <p className="mt-1 text-gray-500">
                  {notifications.filter((n) => n.status === "failed").length} notifications failed to deliver
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Send New Notification</CardTitle>
              <CardDescription>Create and send a custom email notification</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a user" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user1">John Doe (john.doe@example.com)</SelectItem>
                      <SelectItem value="user2">Jane Smith (jane.smith@example.com)</SelectItem>
                      <SelectItem value="user3">Robert Johnson (robert.johnson@example.com)</SelectItem>
                      <SelectItem value="user4">Emily Wilson (emily.wilson@example.com)</SelectItem>
                      <SelectItem value="user5">Michael Brown (michael.brown@example.com)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="Enter email subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <div className="border rounded-md p-4 min-h-[200px]">
                    {/* In a real app, this would be a rich text editor */}
                    <p className="text-gray-500">Rich text editor would go here</p>
                  </div>
                </div>
                <Button className="w-full">Send Notification</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
