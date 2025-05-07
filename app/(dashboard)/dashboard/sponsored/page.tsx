"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ExternalLink, BarChart } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { sponsoredContentAPI } from "@/lib/api"

export default function SponsoredContentPage() {
  const [sponsoredContent, setSponsoredContent] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    coverImage: "",
    sponsor: {
      name: "",
      logo: "",
      website: "",
    },
    placement: "homepage",
    startDate: "",
    endDate: "",
    budget: {
      amount: 0,
      currency: "USD",
    },
    status: "draft",
  })
  const { toast } = useToast()

  useEffect(() => {
    fetchSponsoredContent()
  }, [])

  const fetchSponsoredContent = async () => {
    try {
      setIsLoading(true)
      const response = await sponsoredContentAPI.getAll()
      setSponsoredContent(response.data)
    } catch (error) {
      console.error("Error fetching sponsored content:", error)
      toast({
        title: "Error",
        description: "Failed to load sponsored content.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSelectChange = (name, value) => {
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsSubmitting(true)
      await sponsoredContentAPI.create(formData)
      toast({
        title: "Success",
        description: "Sponsored content created successfully.",
      })
      setShowCreateDialog(false)
      setFormData({
        title: "",
        content: "",
        excerpt: "",
        coverImage: "",
        sponsor: {
          name: "",
          logo: "",
          website: "",
        },
        placement: "homepage",
        startDate: "",
        endDate: "",
        budget: {
          amount: 0,
          currency: "USD",
        },
        status: "draft",
      })
      fetchSponsoredContent()
    } catch (error) {
      console.error("Error creating sponsored content:", error)
      toast({
        title: "Error",
        description: "Failed to create sponsored content.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this sponsored content?")) {
      return
    }

    try {
      await sponsoredContentAPI.delete(id)
      toast({
        title: "Success",
        description: "Sponsored content deleted successfully.",
      })
      fetchSponsoredContent()
    } catch (error) {
      console.error("Error deleting sponsored content:", error)
      toast({
        title: "Error",
        description: "Failed to delete sponsored content.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sponsored Content</h1>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add New
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Sponsored Content</DialogTitle>
              <DialogDescription>Add a new sponsored content item to your blog.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="placement">Placement</Label>
                    <Select
                      value={formData.placement}
                      onValueChange={(value) => handleSelectChange("placement", value)}
                    >
                      <SelectTrigger id="placement">
                        <SelectValue placeholder="Select placement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="homepage">Homepage</SelectItem>
                        <SelectItem value="category">Category Pages</SelectItem>
                        <SelectItem value="sidebar">Sidebar</SelectItem>
                        <SelectItem value="in-content">In-Content</SelectItem>
                        <SelectItem value="newsletter">Newsletter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    required
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverImage">Cover Image URL</Label>
                  <Input
                    id="coverImage"
                    name="coverImage"
                    value={formData.coverImage}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sponsor.name">Sponsor Name</Label>
                    <Input
                      id="sponsor.name"
                      name="sponsor.name"
                      value={formData.sponsor.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsor.logo">Sponsor Logo URL</Label>
                    <Input
                      id="sponsor.logo"
                      name="sponsor.logo"
                      value={formData.sponsor.logo}
                      onChange={handleInputChange}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsor.website">Sponsor Website</Label>
                    <Input
                      id="sponsor.website"
                      name="sponsor.website"
                      value={formData.sponsor.website}
                      onChange={handleInputChange}
                      placeholder="https://example.com"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      name="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budget.amount">Budget Amount</Label>
                    <Input
                      id="budget.amount"
                      name="budget.amount"
                      type="number"
                      value={formData.budget.amount}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget.currency">Currency</Label>
                    <Select
                      value={formData.budget.currency}
                      onValueChange={(value) => handleSelectChange("budget.currency", value)}
                    >
                      <SelectTrigger id="budget.currency">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Campaigns</CardTitle>
            <CardDescription>Active sponsored content campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                sponsoredContent.filter((item) => item.status === "published").length
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Views</CardTitle>
            <CardDescription>Impressions across all campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                sponsoredContent.reduce((total, item) => total + (item.metrics?.views || 0), 0).toLocaleString()
              )}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
            <CardDescription>Clicks across all campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">
              {isLoading ? (
                <span className="animate-pulse">...</span>
              ) : (
                sponsoredContent.reduce((total, item) => total + (item.metrics?.clicks || 0), 0).toLocaleString()
              )}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sponsored Content</CardTitle>
          <CardDescription>Manage your sponsored content campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-gray-300 dark:border-gray-700 border-t-gray-900 dark:border-t-white rounded-full animate-spin"></div>
            </div>
          ) : sponsoredContent.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No sponsored content found</p>
              <Button className="mt-4" onClick={() => setShowCreateDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Campaign
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Sponsor</TableHead>
                  <TableHead>Placement</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Metrics</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sponsoredContent.map((item) => (
                  <TableRow key={item._id}>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {item.sponsor.logo && (
                          <div className="relative h-6 w-6 mr-2">
                            <img
                              src={item.sponsor.logo || "/placeholder.svg"}
                              alt={item.sponsor.name}
                              className="object-contain rounded-full"
                            />
                          </div>
                        )}
                        {item.sponsor.name}
                      </div>
                    </TableCell>
                    <TableCell>{item.placement}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.status === "published"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                            : item.status === "draft"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                        }`}
                      >
                        {item.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(item.startDate), "MMM d, yyyy")} -{" "}
                      {format(new Date(item.endDate), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs">Views: {item.metrics?.views || 0}</span>
                        <span className="text-xs">Clicks: {item.metrics?.clicks || 0}</span>
                        <span className="text-xs">
                          CTR:{" "}
                          {item.metrics?.views
                            ? (((item.metrics?.clicks || 0) / item.metrics.views) * 100).toFixed(2)
                            : 0}
                          %
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={item.sponsor.website} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <BarChart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                          onClick={() => handleDelete(item._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
