"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Download, ExternalLink } from "lucide-react"
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

export default function DigitalProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [productToDelete, setProductToDelete] = useState(null)
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    fileUrl: "",
    productType: "ebook",
    previewUrl: "",
    status: "draft",
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      // In a real app, this would be an API call
      // For demo purposes, we'll use mock data
      const mockProducts = [
        {
          id: "1",
          title: "Ultimate Web Development Guide",
          description: "A comprehensive guide to modern web development techniques and best practices.",
          price: 29.99,
          productType: "ebook",
          fileUrl: "/files/web-dev-guide.pdf",
          previewUrl: "/files/web-dev-guide-preview.pdf",
          status: "published",
          sales: 124,
          revenue: 3717.76,
          createdAt: "2023-05-15T10:30:00Z",
        },
        {
          id: "2",
          title: "React Component Templates",
          description: "A collection of 50+ reusable React components to speed up your development.",
          price: 49.99,
          productType: "template",
          fileUrl: "/files/react-templates.zip",
          previewUrl: "/files/react-templates-preview.zip",
          status: "published",
          sales: 87,
          revenue: 4349.13,
          createdAt: "2023-06-22T14:15:00Z",
        },
        {
          id: "3",
          title: "SEO Optimization Checklist",
          description: "A detailed checklist to improve your website's search engine ranking.",
          price: 19.99,
          productType: "resource",
          fileUrl: "/files/seo-checklist.pdf",
          previewUrl: "/files/seo-checklist-preview.pdf",
          status: "draft",
          sales: 0,
          revenue: 0,
          createdAt: "2023-07-10T09:45:00Z",
        },
      ]

      setProducts(mockProducts)
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error",
        description: "Failed to load digital products",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      if (editingProduct) {
        // Update existing product
        const updatedProducts = products.map((product) =>
          product.id === editingProduct.id ? { ...product, ...formData } : product,
        )
        setProducts(updatedProducts)
        toast({
          title: "Product updated",
          description: "The digital product has been updated successfully",
        })
      } else {
        // Add new product
        const newProduct = {
          id: Date.now().toString(),
          ...formData,
          sales: 0,
          revenue: 0,
          createdAt: new Date().toISOString(),
        }
        setProducts([...products, newProduct])
        toast({
          title: "Product created",
          description: "The digital product has been created successfully",
        })
      }

      // Reset form
      setFormData({
        title: "",
        description: "",
        price: "",
        fileUrl: "",
        productType: "ebook",
        previewUrl: "",
        status: "draft",
      })
      setEditingProduct(null)
    } catch (error) {
      console.error("Error submitting product:", error)
      toast({
        title: "Error",
        description: "Failed to save digital product",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      price: product.price.toString(),
      fileUrl: product.fileUrl,
      productType: product.productType,
      previewUrl: product.previewUrl,
      status: product.status,
    })
  }

  const handleDelete = (product) => {
    setProductToDelete(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    try {
      // In a real app, this would be an API call
      // For demo purposes, we'll simulate success
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedProducts = products.filter((product) => product.id !== productToDelete.id)
      setProducts(updatedProducts)
      toast({
        title: "Product deleted",
        description: "The digital product has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "Failed to delete digital product",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setProductToDelete(null)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Digital Products</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage and sell digital products to your audience</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
              <DialogDescription>
                {editingProduct
                  ? "Update the details of your digital product"
                  : "Create a new digital product to sell to your audience"}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
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
                  <Label htmlFor="price" className="text-right">
                    Price ($)
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="productType" className="text-right">
                    Product Type
                  </Label>
                  <Select
                    value={formData.productType}
                    onValueChange={(value) => handleSelectChange("productType", value)}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select product type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ebook">E-Book</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                      <SelectItem value="resource">Resource</SelectItem>
                      <SelectItem value="software">Software</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="fileUrl" className="text-right">
                    File URL
                  </Label>
                  <Input
                    id="fileUrl"
                    name="fileUrl"
                    value={formData.fileUrl}
                    onChange={handleInputChange}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="previewUrl" className="text-right">
                    Preview URL
                  </Label>
                  <Input
                    id="previewUrl"
                    name="previewUrl"
                    value={formData.previewUrl}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Create Product"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Products</TabsTrigger>
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="draft">Drafts</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <p>Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">No digital products found</p>
              <Button
                className="mt-4"
                variant="outline"
                onClick={() => document.querySelector('[aria-label="Add Product"]')?.click()}
              >
                Create your first product
              </Button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Card key={product.id} className={product.status === "draft" ? "opacity-70" : ""}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{product.title}</CardTitle>
                        <CardDescription>{formatCurrency(product.price)}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{product.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Type: {product.productType.charAt(0).toUpperCase() + product.productType.slice(1)}</span>
                      <span>Status: {product.status.charAt(0).toUpperCase() + product.status.slice(1)}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Sales</p>
                        <p>{product.sales}</p>
                      </div>
                      <div>
                        <p className="font-medium">Revenue</p>
                        <p>{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="published" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((product) => product.status === "published")
              .map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{product.title}</CardTitle>
                        <CardDescription>{formatCurrency(product.price)}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{product.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Type: {product.productType.charAt(0).toUpperCase() + product.productType.slice(1)}</span>
                      <span>Created: {formatDate(product.createdAt)}</span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="font-medium">Sales</p>
                        <p>{product.sales}</p>
                      </div>
                      <div>
                        <p className="font-medium">Revenue</p>
                        <p>{formatCurrency(product.revenue)}</p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Preview
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="draft" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {products
              .filter((product) => product.status === "draft")
              .map((product) => (
                <Card key={product.id} className="opacity-70">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{product.title}</CardTitle>
                        <CardDescription>{formatCurrency(product.price)}</CardDescription>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleEdit(product)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(product)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{product.description}</p>
                    <div className="flex justify-between text-sm">
                      <span>Type: {product.productType.charAt(0).toUpperCase() + product.productType.slice(1)}</span>
                      <span>Created: {formatDate(product.createdAt)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Preview
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
              Are you sure you want to delete "{productToDelete?.title}"? This action cannot be undone.
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
