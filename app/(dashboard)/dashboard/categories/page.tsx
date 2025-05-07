"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Search, Edit, Trash2, Tag, Folder } from "lucide-react"
import { categoriesAPI, tagsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([])
  const [tags, setTags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false)
  const [tagDialogOpen, setTagDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, tagsRes] = await Promise.all([categoriesAPI.getCategories(), tagsAPI.getTags()])
        setCategories(categoriesRes.data || [])
        setTags(tagsRes.data || [])
      } catch (error) {
        console.error("Error fetching categories and tags:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCategorySubmit = async () => {
    try {
      if (editingItem) {
        const response = await categoriesAPI.updateCategory(editingItem._id, formData)
        setCategories(categories.map((cat) => (cat._id === editingItem._id ? response.data : cat)))
      } else {
        const response = await categoriesAPI.createCategory(formData)
        setCategories([...categories, response.data])
      }
      resetForm()
      setCategoryDialogOpen(false)
    } catch (error) {
      console.error("Error saving category:", error)
    }
  }

  const handleTagSubmit = async () => {
    try {
      if (editingItem) {
        const response = await tagsAPI.updateTag(editingItem._id, { name: formData.name })
        setTags(tags.map((tag) => (tag._id === editingItem._id ? response.data : tag)))
      } else {
        const response = await tagsAPI.createTag({ name: formData.name })
        setTags([...tags, response.data])
      }
      resetForm()
      setTagDialogOpen(false)
    } catch (error) {
      console.error("Error saving tag:", error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await categoriesAPI.deleteCategory(id)
        setCategories(categories.filter((cat) => cat._id !== id))
      } catch (error) {
        console.error("Error deleting category:", error)
      }
    }
  }

  const handleDeleteTag = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      try {
        await tagsAPI.deleteTag(id)
        setTags(tags.filter((tag) => tag._id !== id))
      } catch (error) {
        console.error("Error deleting tag:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      color: "#3B82F6",
    })
    setEditingItem(null)
  }

  const openCategoryDialog = (category?: any) => {
    if (category) {
      setEditingItem(category)
      setFormData({
        name: category.name,
        description: category.description || "",
        color: category.color || "#3B82F6",
      })
    } else {
      resetForm()
    }
    setCategoryDialogOpen(true)
  }

  const openTagDialog = (tag?: any) => {
    if (tag) {
      setEditingItem(tag)
      setFormData({
        name: tag.name,
        description: "",
        color: "#3B82F6",
      })
    } else {
      resetForm()
    }
    setTagDialogOpen(true)
  }

  const filteredCategories = categories.filter((cat) => cat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const filteredTags = tags.filter((tag) => tag.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories & Tags</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="tags" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Tags
          </TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="pt-4">
          <div className="flex justify-end mb-4">
            <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openCategoryDialog()} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Category" : "New Category"}</DialogTitle>
                  <DialogDescription>
                    {editingItem
                      ? "Update the details of this category."
                      : "Create a new category for your blog posts."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Category name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Brief description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="color"
                        name="color"
                        type="color"
                        value={formData.color}
                        onChange={handleInputChange}
                        className="w-12 h-8 p-1"
                      />
                      <Input name="color" value={formData.color} onChange={handleInputChange} className="flex-1" />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setCategoryDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCategorySubmit}>{editingItem ? "Update" : "Create"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {loading
              ? Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardHeader>
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2 mt-2" />
                      </CardHeader>
                      <CardContent>
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                      <CardFooter>
                        <Skeleton className="h-9 w-full" />
                      </CardFooter>
                    </Card>
                  ))
              : filteredCategories.map((category) => (
                  <Card key={category._id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }}></div>
                        {category.name}
                      </CardTitle>
                      <CardDescription>{category.postCount || 0} posts in this category</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {category.description || "No description provided."}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                      <Button variant="outline" size="sm" onClick={() => openCategoryDialog(category)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCategory(category._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            {!loading && filteredCategories.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <Folder className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No categories found</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "Try adjusting your search" : "Create a category to get started"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="tags" className="pt-4">
          <div className="flex justify-end mb-4">
            <Dialog open={tagDialogOpen} onOpenChange={setTagDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => openTagDialog()} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Tag
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{editingItem ? "Edit Tag" : "New Tag"}</DialogTitle>
                  <DialogDescription>
                    {editingItem ? "Update the name of this tag." : "Create a new tag for your blog posts."}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="tag-name">Name</Label>
                    <Input
                      id="tag-name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Tag name"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setTagDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleTagSubmit}>{editingItem ? "Update" : "Create"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-md p-4">
            <div className="flex flex-wrap gap-2">
              {loading
                ? Array(12)
                    .fill(0)
                    .map((_, i) => <Skeleton key={i} className="h-8 w-20" />)
                : filteredTags.map((tag) => (
                    <Badge key={tag._id} variant="outline" className="flex items-center gap-2 px-3 py-1.5 text-sm">
                      {tag.name}
                      <span className="text-xs text-muted-foreground">({tag.postCount || 0})</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1 rounded-full"
                        onClick={() => openTagDialog(tag)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 rounded-full text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTag(tag._id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
              {!loading && filteredTags.length === 0 && (
                <div className="w-full flex flex-col items-center justify-center py-12 text-center">
                  <Tag className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg">No tags found</h3>
                  <p className="text-muted-foreground">
                    {searchTerm ? "Try adjusting your search" : "Create a tag to get started"}
                  </p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
