"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, ExternalLink, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

interface AffiliateProgram {
  id: string
  name: string
  description: string
  url: string
  affiliateCode: string
  category: string
  commission: string
  status: string
  clicks: number
  conversions: number
  revenue: number
  createdAt: string
}

interface FormData {
  name: string
  description: string
  url: string
  affiliateCode: string
  category: string
  commission: string
  status: string
}

export default function AffiliateLinksPage() {
  const [programs, setPrograms] = useState<AffiliateProgram[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingLink, setEditingLink] = useState<AffiliateProgram | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [linkToDelete, setLinkToDelete] = useState<AffiliateProgram | null>(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    url: "",
    affiliateCode: "",
    category: "technology",
    commission: "",
    status: "active",
  })

  useEffect(() => {
    fetchPrograms()
  }, [])

  const fetchPrograms = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const mockPrograms: AffiliateProgram[] = [
        {
          id: "1",
          name: "Amazon Web Services",
          description: "Cloud computing services for businesses and developers.",
          url: "https://aws.amazon.com",
          affiliateCode: "modernblog-20",
          category: "technology",
          commission: "3%",
          status: "active",
          clicks: 342,
          conversions: 28,
          revenue: 1245.67,
          createdAt: "2023-04-10T08:30:00Z",
        },
        {
          id: "2",
          name: "Webflow",
          description: "Design and build professional websites without coding.",
          url: "https://webflow.com",
          affiliateCode: "modernblog",
          category: "design",
          commission: "30%",
          status: "active",
          clicks: 215,
          conversions: 12,
          revenue: 864.00,
          createdAt: "2023-05-22T14:45:00Z",
        },
        {
          id: "3",
          name: "ConvertKit",
          description: "Email marketing platform for creators.",
          url: "https://convertkit.com",
          affiliateCode: "modernblog",
          category: "marketing",
          commission: "30%",
          status: "inactive",
          clicks: 178,
          conversions: 8,
          revenue: 432.00,
          createdAt: "2023-06-15T11:20:00Z",
        },
      ]
      
      setPrograms(mockPrograms)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching affiliate programs:", error)
      toast({
        title: "Error",
        description: "Failed to load affiliate programs",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingLink) {
        // Update existing link
        const updatedPrograms = programs.map((program) =>
          program.id === editingLink.id ? { ...program, ...formData } : program
        )
        setPrograms(updatedPrograms)
        toast({
          title: "Program updated",
          description: "The affiliate program has been updated successfully",
        })
      } else {
        // Add new link
        const newProgram: AffiliateProgram = {
          id: Date.now().toString(),
          ...formData,
          clicks: 0,
          conversions: 0,
          revenue: 0,
          createdAt: new Date().toISOString(),
        }
        setPrograms([...programs, newProgram])
        toast({
          title: "Program created",
          description: "The affiliate program has been created successfully",
        })
      }

      // Reset form
      setFormData({
        name: "",
        description: "",
        url: "",
        affiliateCode: "",
        category: "technology",
        commission: "",
        status: "active",
      })
      setEditingLink(null)
    } catch (error) {
      console.error("Error submitting affiliate program:", error)
      toast({
        title: "Error",
        description: "Failed to save affiliate program",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (program: AffiliateProgram) => {
    setEditingLink(program)
    setFormData({
      name: program.name,
      description: program.description,
      url: program.url,
      affiliateCode: program.affiliateCode,
      category: program.category,
      commission: program.commission,
      status: program.status,
    })
  }

  const handleDelete = (program: AffiliateProgram) => {
    setLinkToDelete(program)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedPrograms = programs.filter((program) => program.id !== linkToDelete?.id)
      setPrograms(updatedPrograms)
      toast({
        title: "Program deleted",
        description: "The affiliate program has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting affiliate program:", error)
      toast({
        title: "Error",
        description: "Failed to delete affiliate program",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setLinkToDelete(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getAffiliateUrl = (program: AffiliateProgram) => {
    const url = new URL(program.url)
    if (url.search) {
      return `${program.url}&ref=${program.affiliateCode}`
    }
    return `${program.url}?ref=${program.affiliateCode}`
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Affiliate Programs</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Manage your affiliate partnerships and track performance
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Affiliate Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingLink ? "Edit Affiliate Program" : "Add New Affiliate Program"}</DialogTitle>
              <DialogDescription>
                {editingLink
                  ? "Update the details of your affiliate program"
                  : "Create a new affiliate program to promote products and earn commissions"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="url" className="text-right">
                    URL
                  </Label>
                  <Input
                    id="url"
                    name="url"
                    type="url"
                    value={formData.url}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="affiliateCode" className="text-right">
                    Affiliate Code
                  </Label>
                  <Input
                    id="affiliateCode"
                    name="affiliateCode"
                    value={formData.affiliateCode}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                      <SelectItem value="marketing">Marketing</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="commission" className="text-right">
                    Commission
                  </Label>
                  <Input
                    id="commission"
                    name="commission"
                    value={formData.commission}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="e.g., 10%, $5 per sale"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleSelectChange("status", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingLink ? "Update Program" : "Create Program"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Programs</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading affiliate programs...</p>
            </div>
          ) : programs.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No affiliate programs found</p>
              <Button 
                className="mt-4" 
                variant="outline" 
                onClick={() => {
                  const button = document.querySelector('[aria-label="Add Affiliate Program"]')
                  if (button instanceof HTMLElement) {
                    button.click()
                  }
                }}
              >
                Create your first affiliate program
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((program) => (
                <Card key={program.id} className={program.status === "inactive" ? "opacity-70" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{program.name}</CardTitle>
                        <CardDescription>{program.category.charAt(0).toUpperCase() + program.category.slice(1)}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(program)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(program)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{program.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Commission: {program.commission}</span>
                      <span>Status: {program.status.charAt(0).toUpperCase() + program.status.slice(1)}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Clicks</p>
                        <p>{program.clicks}</p>
                      </div>
                      <div>
                        <p className="font-medium">Conversions</p>
                        <p>{program.conversions}</p>
                      </div>
                      <div>
                        <p className="font-medium">Revenue</p>
                        <p>{formatCurrency(program.revenue)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <a href={getAffiliateUrl(program)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs
              .filter((program) => program.status === "active")
              .map((program) => (
                <Card key={program.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{program.name}</CardTitle>
                        <CardDescription>{program.category.charAt(0).toUpperCase() + program.category.slice(1)}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(program)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(program)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{program.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Commission: {program.commission}</span>
                      <span>Created: {formatDate(program.createdAt)}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Clicks</p>
                        <p>{program.clicks}</p>
                      </div>
                      <div>
                        <p className="font-medium">Conversions</p>
                        <p>{program.conversions}</p>
                      </div>
                      <div>
                        <p className="font-medium">Revenue</p>
                        <p>{formatCurrency(program.revenue)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <a href={getAffiliateUrl(program)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="inactive" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs
              .filter((program) => program.status === "inactive")
              .map((program) => (
                <Card key={program.id} className="opacity-70">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{program.name}</CardTitle>
                        <CardDescription>{program.category.charAt(0).toUpperCase() + program.category.slice(1)}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(program)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(program)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{program.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Commission: {program.commission}</span>
                      <span>Created: {formatDate(program.createdAt)}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Clicks</p>
                        <p>{program.clicks}</p>
                      </div>
                      <div>
                        <p className="font-medium">Conversions</p>
                        <p>{program.conversions}</p>
                      </div>
                      <div>
                        <p className="font-medium">Revenue</p>
                        <p>{formatCurrency(program.revenue)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <a href={getAffiliateUrl(program)} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Visit
                      </a>
                    </Button>
                    <Button variant="outline" size="sm">
                      <BarChart className="mr-2 h-4 w-4" />
                      Analytics
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the affiliate program for "{linkToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
