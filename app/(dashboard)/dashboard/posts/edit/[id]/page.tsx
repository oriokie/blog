"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { RichTextEditor } from "@/components/editor/rich-text-editor"
import { postsAPI, categoriesAPI } from "@/lib/api"
import { toast } from "sonner"

interface Category {
  _id: string
  name: string
  slug: string
  description?: string
  color?: string
}

interface Post {
  _id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  status: string
  scheduledFor?: string
  tags: string[]
}

export default function EditPostPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState<Post>({
    _id: "",
    title: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "",
    status: "draft",
    tags: [],
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postResponse, categoriesResponse] = await Promise.all([
          postsAPI.getPost(params.id),
          categoriesAPI.getCategories(),
        ])
        setFormData(postResponse.data)
        setCategories(categoriesResponse.data)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Failed to load post data")
        router.push("/dashboard/posts")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, scheduledFor: date?.toISOString() }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await postsAPI.updatePost(params.id, {
        ...formData,
        scheduledFor: formData.scheduledFor,
      })

      toast.success("Post updated successfully")
      router.push("/dashboard/posts")
    } catch (error: any) {
      console.error("Error updating post:", error)
      toast.error(error.response?.data?.message || "Failed to update post")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="container mx-auto py-6">Loading...</div>
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium mb-2">
                Title
              </label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter post title"
                required
              />
            </div>

            <div>
              <label htmlFor="excerpt" className="block text-sm font-medium mb-2">
                Excerpt
              </label>
              <Textarea
                id="excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Enter post excerpt"
                className="h-24"
              />
            </div>

            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium mb-2">
                Cover Image URL
              </label>
              <Input
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">
                Category
              </label>
              <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-2">
                Status
              </label>
              <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.status === "scheduled" && (
              <div>
                <label className="block text-sm font-medium mb-2">Schedule Date</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.scheduledFor && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.scheduledFor ? format(new Date(formData.scheduledFor), "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.scheduledFor ? new Date(formData.scheduledFor) : undefined}
                      onSelect={handleDateSelect}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <RichTextEditor
                content={formData.content}
                onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
                placeholder="Write your post content here..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
} 