"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Share, History, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { CollaborativeEditor } from "@/components/collaborative-editor/editor"
import { api } from "@/lib/api"

export default function DocumentPage() {
  const [document, setDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [title, setTitle] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const documentId = params.id

  useEffect(() => {
    fetchDocument()
  }, [documentId])

  const fetchDocument = async () => {
    setIsLoading(true)
    try {
      const response = await api.get(`/documents/${documentId}`)
      const doc = response.data.data
      setDocument(doc)
      setTitle(doc.title)
    } catch (error) {
      console.error("Error fetching document:", error)
      toast({
        title: "Error",
        description: "Failed to load document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateDocumentTitle = async () => {
    if (!title.trim()) return

    setIsSaving(true)
    try {
      await api.put(`/documents/${documentId}`, { title })
      toast({
        title: "Title updated",
        description: "Document title has been updated successfully.",
      })
    } catch (error) {
      console.error("Error updating document title:", error)
      toast({
        title: "Error",
        description: "Failed to update document title. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleTitleChange = (e) => {
    setTitle(e.target.value)
  }

  const handleTitleBlur = () => {
    if (title !== document.title) {
      updateDocumentTitle()
    }
  }

  const handleTitleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.target.blur()
    }
  }

  const goToDocumentsList = () => {
    router.push("/dashboard/documents")
  }

  const goToSharePage = () => {
    router.push(`/dashboard/documents/${documentId}/share`)
  }

  const goToHistoryPage = () => {
    router.push(`/dashboard/documents/${documentId}/history`)
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={goToDocumentsList}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          {isLoading ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <Input
              value={title}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="text-xl font-bold h-10 border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
            />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToHistoryPage}>
            <History className="mr-2 h-4 w-4" />
            History
          </Button>
          <Button variant="outline" size="sm" onClick={goToSharePage}>
            <Share className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Users className="mr-2 h-4 w-4" />
            {document?.collaborators.length || 0} Collaborators
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-[600px] w-full" />
        </div>
      ) : (
        <CollaborativeEditor documentId={documentId} initialContent={document.content} />
      )}
    </div>
  )
}
