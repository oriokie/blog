"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { nanoid } from "nanoid"
import { Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Collaboration from "@tiptap/extension-collaboration"
import CollaborationCursor from "@tiptap/extension-collaboration-cursor"
import * as Y from "yjs"
import { WebrtcProvider } from "y-webrtc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"

interface CollaborativeEditorProps {
  documentId: string
  initialContent?: string
  readOnly?: boolean
}

export function CollaborativeEditor({ documentId, initialContent = "", readOnly = false }: CollaborativeEditorProps) {
  const [editor, setEditor] = useState<Editor | null>(null)
  const [activeUsers, setActiveUsers] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const providerRef = useRef<WebrtcProvider | null>(null)
  const ydocRef = useRef<Y.Doc | null>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Initialize Yjs document
    const ydoc = new Y.Doc()
    ydocRef.current = ydoc

    // Initialize WebRTC provider for real-time collaboration
    const provider = new WebrtcProvider(`oriokiex-doc-${documentId}`, ydoc, {
      signaling: ["wss://signaling.yjs.dev"],
      password: "oriokiex-secure-editing",
      awareness: {
        clientID: nanoid(),
        user: {
          name: user?.firstName || "Anonymous",
          color: getRandomColor(),
          avatar: user?.avatar || null,
        },
      },
    })

    providerRef.current = provider

    // Track active users
    provider.awareness.on("change", () => {
      const users: any[] = []
      provider.awareness.getStates().forEach((state: any, clientId: number) => {
        if (state.user) {
          users.push({
            clientId,
            ...state.user,
          })
        }
      })
      setActiveUsers(users)
    })

    // Set connection status
    provider.on("status", ({ status }: { status: string }) => {
      setIsConnected(status === "connected")
    })

    // Initialize editor
    const newEditor = new Editor({
      extensions: [
        StarterKit.configure({
          history: false, // Disable history as it's handled by Yjs
        }),
        Collaboration.configure({
          document: ydoc,
        }),
        CollaborationCursor.configure({
          provider: provider.awareness,
          user: {
            name: user?.firstName || "Anonymous",
            color: getRandomColor(),
            avatar: user?.avatar || null,
          },
        }),
      ],
      content: initialContent,
      editable: !readOnly,
      onUpdate: ({ editor }) => {
        // Handle content updates
        console.log("Content updated")
      },
    })

    setEditor(newEditor)

    return () => {
      if (newEditor) {
        newEditor.destroy()
      }
      if (provider) {
        provider.destroy()
      }
      if (ydoc) {
        ydoc.destroy()
      }
    }
  }, [documentId, initialContent, readOnly, user])

  const saveDocument = async () => {
    if (!editor) return

    setIsSaving(true)
    try {
      // Get HTML content from editor
      const content = editor.getHTML()

      // Save to API
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to save document")
      }

      toast({
        title: "Document saved",
        description: "Your changes have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving document:", error)
      toast({
        title: "Error saving document",
        description: "There was a problem saving your changes.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const shareDocument = () => {
    const url = `${window.location.origin}/documents/${documentId}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "Collaboration link copied to clipboard",
    })
  }

  // Helper function to generate random colors for user cursors
  function getRandomColor() {
    const colors = [
      "#f44336",
      "#e91e63",
      "#9c27b0",
      "#673ab7",
      "#3f51b5",
      "#2196f3",
      "#03a9f4",
      "#00bcd4",
      "#009688",
      "#4caf50",
      "#8bc34a",
      "#cddc39",
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="collaborative-editor">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Collaborative Document</CardTitle>
            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex -space-x-2">
                      {activeUsers.slice(0, 3).map((user) => (
                        <Avatar key={user.clientId} className="border-2 border-background w-8 h-8">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                          <AvatarFallback style={{ backgroundColor: user.color }} className="text-white text-xs">
                            {user.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                      {activeUsers.length > 3 && (
                        <Avatar className="border-2 border-background w-8 h-8">
                          <AvatarFallback className="bg-muted text-xs">+{activeUsers.length - 3}</AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {activeUsers.length} active user{activeUsers.length !== 1 ? "s" : ""}:{" "}
                      {activeUsers.map((u) => u.name).join(", ")}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}></div>
                <span className="text-xs text-muted-foreground">{isConnected ? "Connected" : "Disconnected"}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-4 min-h-[300px]">
            {editor && <div className="ProseMirror">{editor.view.dom}</div>}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={shareDocument}>
              Share
            </Button>
            <Button onClick={saveDocument} disabled={isSaving || readOnly}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
