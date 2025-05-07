"use client"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { categoriesAPI, tagsAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function CategoriesPage() {
  const [activeTab, setActiveTab] = useState("categories")
  const [categories, setCategories] = useState([])
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [newCategory, setNewCategory] = useState({ name: "", description: "", color: "#3B82F6" })
  const [newTag, setNewTag] = useState({ name: "" })
  const [editingCategory, setEditingCategory] = useState(null)
  const [editingTag, setEditingTag] = useState(null)
  const [showAddCategory, setShowAddCategory] = useState(false)
  const [showAddTag, setShowAddTag] = useState(false)

  const { toast } = useToast()

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)

      if (activeTab === "categories") {
        const response = await categoriesAPI.getCategories()
        setCategories(response.data)
      } else {
        const response = await tagsAPI.getTags()
        setTags(response.data)
      }
    } catch (error) {
      console.error(`Error fetching ${activeTab}:`, error)
      toast({
        title: "Error",
        description: `Failed to load ${activeTab}`,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddCategory = async () => {
    try {
      if (!newCategory.name) {
        toast({
          title: "Error",
          description: "Category name is required",
          variant: "destructive",
        })
        return
      }

      const response = await categoriesAPI.createCategory(newCategory)

      setCategories([...categories, response.data])
      setNewCategory({ name: "", description: "", color: "#3B82F6" })
      setShowAddCategory(false)

      toast({
        title: "Success",
        description: "Category added successfully",
      })
    } catch (error) {
      console.error("Error adding category:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add category",
        variant: "destructive",
      })
    }
  }

  const handleUpdateCategory = async () => {
    try {
      if (!editingCategory.name) {
        toast({
          title: "Error",
          description: "Category name is required",
          variant: "destructive",
        })
        return
      }

      const response = await categoriesAPI.updateCategory(editingCategory._id, editingCategory)

      setCategories(categories.map((cat) => (cat._id === editingCategory._id ? response.data : cat)))
      setEditingCategory(null)

      toast({
        title: "Success",
        description: "Category updated successfully",
      })
    } catch (error) {
      console.error("Error updating category:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update category",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCategory = async (id) => {
    try {
      await categoriesAPI.deleteCategory(id)

      setCategories(categories.filter((cat) => cat._id !== id))

      toast({
        title: "Success",
        description: "Category deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting category:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete category",
        variant: "destructive",
      })
    }
  }

  const handleAddTag = async () => {
    try {
      if (!newTag.name) {
        toast({
          title: "Error",
          description: "Tag name is required",
          variant: "destructive",
        })
        return
      }

      const response = await tagsAPI.createTag(newTag)

      setTags([...tags, response.data])
      setNewTag({ name: "" })
      setShowAddTag(false)

      toast({
        title: "Success",
        description: "Tag added successfully",
      })
    } catch (error) {
      console.error("Error adding tag:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add tag",
        variant: "destructive",
      })
    }
  }

  const handleUpdateTag = async () => {
    try {
      if (!editingTag.name) {
        toast({
          title: "Error",
          description: "Tag name is required",
          variant: "destructive",
        })
        return
      }

      const response = await tagsAPI.updateTag(editingTag._id, editingTag)

      setTags(tags.map((tag) => (tag._id === editingTag._id ? response.data : tag)))
      setEditingTag(null)

      toast({
        title: "Success",
        description: "Tag updated successfully",
      })
    } catch (error) {
      console.error("Error updating tag:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update tag",
        variant: "destructive",
      })
    }
  }

  const handleDeleteTag = async (id) => {
    try {
      await tagsAPI.deleteTag(id)

      setTags(tags.filter((tag) => tag._id !== id))

      toast({
        title: "Success",
        description: "Tag deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting tag:", error)
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete tag",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Categories & Tags</h2>
          <p className="text-gray-500 dark:text-gray-400">Organize your content with categories and tags</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Categories</CardTitle>
                <CardDescription>Manage your blog categories</CardDescription>
              </div>
              <Button onClick={() => setShowAddCategory(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg animate-pulse"
                      >
                        <div className="space-y-2">
                          <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded"></div>
                          <div className="h-3 w-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        </div>
                        <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      </div>
                    ))}
                </div>
              ) : categories.length > 0 ? (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category._id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      <div className="space-y-1 mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: category.color }}></div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">{category.name}</h3>
                        </div>
                        {category.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{category.description}</p>
                        )}
                        <p className="text-xs text-gray-500 dark:text-gray-400">{category.postCount || 0} posts</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setEditingCategory(category)}>
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDeleteCategory(category._id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No categories found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by creating your first category.</p>
                  <Button onClick={() => setShowAddCategory(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Category
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tags</CardTitle>
                <CardDescription>Manage your blog tags</CardDescription>
              </div>
              <Button onClick={() => setShowAddTag(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {Array(12)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                    ))}
                </div>
              ) : tags.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {tags.map((tag) => (
                    <div
                      key={tag._id}
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-800 rounded-lg"
                    >
                      <span className="font-medium truncate">{tag.name}</span>
                      <div className="flex items-center">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => setEditingTag(tag)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDeleteTag(tag._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 mx-auto text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tags found</h3>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">Get started by creating your first tag.</p>
                  <Button onClick={() => setShowAddTag(true)} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Category Dialog */}
      <Dialog open={showAddCategory} onOpenChange={setShowAddCategory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a new category to organize your posts.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="Category name"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Category description (optional)"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="color" className="text-sm font-medium">
                Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  id="color"
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  className="w-10 h-10 rounded cursor-pointer"
                />
                <Input
                  value={newCategory.color}
                  onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddCategory(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory}>Add Category</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      {editingCategory && (
        <Dialog open={!!editingCategory} onOpenChange={(open) => !open && setEditingCategory(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Category</DialogTitle>
              <DialogDescription>Update category details.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="edit-name"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  placeholder="Category name"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="edit-description"
                  value={editingCategory.description || ""}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  placeholder="Category description (optional)"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="edit-color" className="text-sm font-medium">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    id="edit-color"
                    value={editingCategory.color || "#3B82F6"}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    className="w-10 h-10 rounded cursor-pointer"
                  />
                  <Input
                    value={editingCategory.color || "#3B82F6"}
                    onChange={(e) => setEditingCategory({ ...editingCategory, color: e.target.value })}
                    placeholder="#3B82F6"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCategory(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCategory}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Tag Dialog */}
      <Dialog open={showAddTag} onOpenChange={setShowAddTag}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Tag</DialogTitle>
            <DialogDescription>Create a new tag to organize your posts.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="tag-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="tag-name"
                value={newTag.name}
                onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
                placeholder="Tag name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTag(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTag}>Add Tag</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Tag Dialog */}
      {editingTag && (
        <Dialog open={!!editingTag} onOpenChange={(open) => !open && setEditingTag(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Tag</DialogTitle>
              <DialogDescription>Update tag details.</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="edit-tag-name" className="text-sm font-medium">
                  Name
                </label>
                <Input
                  id="edit-tag-name"
                  value={editingTag.name}
                  onChange={(e) => setEditingTag({ ...editingTag, name: e.target.value })}
                  placeholder="Tag name"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingTag(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTag}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
