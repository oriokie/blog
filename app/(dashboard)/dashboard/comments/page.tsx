"use client"

import { useState, useEffect } from "react"
import { Search, MoreHorizontal, Trash2, MessageSquare } from "lucide-react"
import { commentsAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedComment, setSelectedComment] = useState<any>(null)
  const [replyDialogOpen, setReplyDialogOpen] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [replyLoading, setReplyLoading] = useState(false)

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await commentsAPI.getComments()
        setComments(response.data.comments || [])
      } catch (error) {
        console.error("Error fetching comments:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchComments()
  }, [])

  const handleDeleteComment = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await commentsAPI.deleteComment(id)
        setComments(comments.filter((comment) => comment._id !== id))
      } catch (error) {
        console.error("Error deleting comment:", error)
      }
    }
  }

  const handleReplySubmit = async () => {
    if (!selectedComment || !replyText.trim()) return

    setReplyLoading(true)
    try {
      await commentsAPI.replyToComment(selectedComment._id, replyText)
      // Refresh comments after reply
      const response = await commentsAPI.getComments()
      setComments(response.data.comments || [])
      setReplyDialogOpen(false)
      setReplyText("")
    } catch (error) {
      console.error("Error replying to comment:", error)
    } finally {
      setReplyLoading(false)
    }
  }

  const openReplyDialog = (comment: any) => {
    setSelectedComment(comment)
    setReplyDialogOpen(true)
  }

  const filteredComments = comments.filter((comment) => {
    return (
      comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comment.post?.title && comment.post.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (comment.user?.firstName &&
        `${comment.user.firstName} ${comment.user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Comments</h2>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search comments..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Comment</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Post</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-12" />
                    </TableCell>
                  </TableRow>
                ))
            ) : filteredComments.length > 0 ? (
              filteredComments.map((comment) => (
                <TableRow key={comment._id}>
                  <TableCell className="max-w-xs truncate">{comment.text}</TableCell>
                  <TableCell>
                    {comment.user ? (
                      `${comment.user.firstName} ${comment.user.lastName}`
                    ) : (
                      <span className="text-muted-foreground">Anonymous</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {comment.post ? (
                      <a href={`/blog/${comment.post.slug}`} className="text-primary hover:underline">
                        {comment.post.title}
                      </a>
                    ) : (
                      <span className="text-muted-foreground">Unknown post</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(comment.createdAt)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openReplyDialog(comment)}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Reply
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDeleteComment(comment._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                  No comments found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Comment</DialogTitle>
            <DialogDescription>Your reply will be posted as a new comment on the same post.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm font-medium">Original Comment:</p>
              <p className="text-sm mt-1">{selectedComment?.text}</p>
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>
                  By:{" "}
                  {selectedComment?.user
                    ? `${selectedComment.user.firstName} ${selectedComment.user.lastName}`
                    : "Anonymous"}
                </span>
                <span>On: {selectedComment?.createdAt ? formatDate(selectedComment.createdAt) : "Unknown date"}</span>
              </div>
            </div>
            <Textarea
              placeholder="Write your reply..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReplySubmit} disabled={!replyText.trim() || replyLoading}>
              {replyLoading ? "Sending..." : "Reply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
