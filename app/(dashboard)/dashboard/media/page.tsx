"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Upload, Search, Filter, MoreHorizontal, Trash2, Edit, ImageIcon, FileText, Film, Eye } from "lucide-react"
import { mediaAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MediaLibraryPage() {
  const [media, setMedia] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [uploadPreview, setUploadPreview] = useState<string | null>(null)
  const [uploadData, setUploadData] = useState({
    alt: "",
    caption: "",
  })

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await mediaAPI.getMedia()
        setMedia(response.data.media || [])
      } catch (error) {
        console.error("Error fetching media:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMedia()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setUploadFile(file)

      // Create preview for images
      if (file.type.startsWith("image/")) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setUploadPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      } else {
        setUploadPreview(null)
      }
    }
  }

  const handleUpload = async () => {
    if (!uploadFile) return

    setUploadLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", uploadFile)
      formData.append("alt", uploadData.alt || uploadFile.name)
      formData.append("caption", uploadData.caption)

      const response = await mediaAPI.uploadMedia(formData)
      setMedia([response.data, ...media])
      setUploadDialogOpen(false)
      resetUploadForm()
    } catch (error) {
      console.error("Error uploading media:", error)
    } finally {
      setUploadLoading(false)
    }
  }

  const resetUploadForm = () => {
    setUploadFile(null)
    setUploadPreview(null)
    setUploadData({ alt: "", caption: "" })
  }

  const handleDeleteMedia = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this media item?")) {
      try {
        await mediaAPI.deleteMedia(id)
        setMedia(media.filter((item) => item._id !== id))
      } catch (error) {
        console.error("Error deleting media:", error)
      }
    }
  }

  const filteredMedia = media.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "image" && item.type.startsWith("image/")) ||
      (typeFilter === "video" && item.type.startsWith("video/")) ||
      (typeFilter === "document" && !item.type.startsWith("image/") && !item.type.startsWith("video/"))
    return matchesSearch && matchesType
  })

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return <Image className="h-6 w-6" />
    if (type.startsWith("video/")) return <Film className="h-6 w-6" />
    return <FileText className="h-6 w-6" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
              <DialogDescription>Upload images, videos, or documents to your media library.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6">
                {uploadPreview ? (
                  <div className="relative w-full">
                    <img
                      src={uploadPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="mx-auto max-h-[200px] object-contain"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => {
                        setUploadFile(null)
                        setUploadPreview(null)
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                    <Input
                      type="file"
                      className="max-w-xs"
                      onChange={handleFileChange}
                      accept="image/*,video/*,application/pdf"
                    />
                  </>
                )}
              </div>
              {uploadFile && (
                <div className="space-y-2">
                  <Input
                    placeholder="Alt text"
                    value={uploadData.alt}
                    onChange={(e) => setUploadData({ ...uploadData, alt: e.target.value })}
                  />
                  <Input
                    placeholder="Caption (optional)"
                    value={uploadData.caption}
                    onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpload} disabled={!uploadFile || uploadLoading}>
                {uploadLoading ? "Uploading..." : "Upload"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search media..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Filter by type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Media</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="document">Documents</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        <TabsContent value="grid" className="pt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {loading
              ? Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                      <Skeleton className="h-40 w-full" />
                      <CardContent className="p-3">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </CardContent>
                    </Card>
                  ))
              : filteredMedia.map((item) => (
                  <Card key={item._id} className="overflow-hidden">
                    <div className="relative h-40 bg-muted">
                      {item.type.startsWith("image/") ? (
                        <img
                          src={item.url || "/placeholder.svg"}
                          alt={item.alt || item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">{getFileIcon(item.type)}</div>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center">
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="flex items-center text-destructive focus:text-destructive"
                            onClick={() => handleDeleteMedia(item._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardContent className="p-3">
                      <p className="font-medium truncate text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(item.size)}</p>
                    </CardContent>
                  </Card>
                ))}
            {!loading && filteredMedia.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium text-lg">No media found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || typeFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "Upload some media to get started"}
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="list" className="pt-4">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="py-3 px-4 text-left font-medium">File</th>
                  <th className="py-3 px-4 text-left font-medium">Type</th>
                  <th className="py-3 px-4 text-left font-medium">Size</th>
                  <th className="py-3 px-4 text-left font-medium">Date</th>
                  <th className="py-3 px-4 text-left font-medium w-[100px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading
                  ? Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <tr key={i} className="border-b">
                          <td className="py-3 px-4">
                            <Skeleton className="h-6 w-full" />
                          </td>
                          <td className="py-3 px-4">
                            <Skeleton className="h-6 w-20" />
                          </td>
                          <td className="py-3 px-4">
                            <Skeleton className="h-6 w-16" />
                          </td>
                          <td className="py-3 px-4">
                            <Skeleton className="h-6 w-24" />
                          </td>
                          <td className="py-3 px-4">
                            <Skeleton className="h-6 w-12" />
                          </td>
                        </tr>
                      ))
                  : filteredMedia.map((item) => (
                      <tr key={item._id} className="border-b">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getFileIcon(item.type)}
                            <span className="truncate max-w-[200px]">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">{item.type.split("/")[1]}</td>
                        <td className="py-3 px-4">{formatFileSize(item.size)}</td>
                        <td className="py-3 px-4">{new Date(item.createdAt).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <a
                                  href={item.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center">
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="flex items-center text-destructive focus:text-destructive"
                                onClick={() => handleDeleteMedia(item._id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                {!loading && filteredMedia.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium text-lg">No media found</h3>
                        <p className="text-muted-foreground">
                          {searchTerm || typeFilter !== "all"
                            ? "Try adjusting your search or filters"
                            : "Upload some media to get started"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
