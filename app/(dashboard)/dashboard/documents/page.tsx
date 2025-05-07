"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, FileText, Clock, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/api"

export default function DocumentsPage() {
  const [documents, setDocuments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    setIsLoading(true)
    try {
      const response = await api.get("/documents")
      setDocuments(response.data.data)
    } catch (error) {
      console.error("Error fetching documents:", error)
      toast({
        title: "Error",
        description: "Failed to load documents. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const createNewDocument = async () => {
    try {
      const response = await api.post("/documents", {
        title: "Untitled Document",
        content: "<p>Start writing your collaborative document...</p>",
      })

      toast({
        title: "Document created",
        description: "Your new document has been created.",
      })

      router.push(`/dashboard/documents/${response.data.data._id}`)
    } catch (error) {
      console.error("Error creating document:", error)
      toast({
        title: "Error",
        description: "Failed to create document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const deleteDocument = async (id) => {
    try {
      await api.delete(`/documents/${id}`)

      toast({
        title: "Document deleted",
        description: "The document has been deleted successfully.",
      })

      // Refresh documents list
      fetchDocuments()
    } catch (error) {
      console.error("Error deleting document:", error)
      toast({
        title: "Error",
        description: "Failed to delete document. Please try again.",
        variant: "destructive",
      })
    }
  }

  const filteredDocuments = documents.filter((doc) => doc.title.toLowerCase().includes(searchQuery.toLowerCase()))

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Collaborative Documents</h1>
        <Button onClick={createNewDocument}>
          <Plus className="mr-2 h-4 w-4" /> New Document
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search documents..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="owned">Owned by Me</TabsTrigger>
          <TabsTrigger value="shared">Shared with Me</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-8"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : filteredDocuments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.map((doc) => (
                <Card key={doc._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="line-clamp-1">{doc.title}</CardTitle>
                        <CardDescription>
                          {doc.documentType.charAt(0).toUpperCase() + doc.documentType.slice(1)}
                        </CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/documents/${doc._id}`)}>
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/dashboard/documents/${doc._id}/share`)}>
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteDocument(doc._id)}
                            className="text-red-500 focus:text-red-500"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className="line-clamp-3 text-sm text-muted-foreground"
                      dangerouslySetInnerHTML={{
                        __html: doc.content.replace(/<[^>]*>/g, " ").substring(0, 150) + "...",
                      }}
                    />
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span>Updated {formatDate(doc.updatedAt)}</span>
                    </div>
                    <div className="flex items-center">
                      {doc.collaborators.length > 0 && (
                        <div className="flex -space-x-2 mr-2">
                          {doc.collaborators.slice(0, 3).map((collab) => (
                            <div
                              key={collab.user._id}
                              className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs border-2 border-background"
                              title={`${collab.user.firstName} ${collab.user.lastName}`}
                            >
                              {collab.user.firstName.charAt(0)}
                            </div>
                          ))}
                          {doc.collaborators.length > 3 && (
                            <div className="w-6 h-6 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-xs border-2 border-background">
                              +{doc.collaborators.length - 3}
                            </div>
                          )}
                        </div>
                      )}
                      <FileText className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No documents found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? `No documents matching "${searchQuery}"` : "Create your first document to get started"}
              </p>
              <Button className="mt-4" onClick={createNewDocument}>
                <Plus className="mr-2 h-4 w-4" /> Create Document
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="owned" className="mt-6">
          {/* Similar content as "all" but filtered for owned documents */}
        </TabsContent>
        <TabsContent value="shared" className="mt-6">
          {/* Similar content as "all" but filtered for shared documents */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
