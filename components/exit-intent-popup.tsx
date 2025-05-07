"use client"

import type React from "react"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from "lucide-react"
import { newsletterAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface ExitIntentPopupProps {
  title?: string
  description?: string
  ctaText?: string
  ctaUrl?: string
  newsletterEnabled?: boolean
}

export function ExitIntentPopup({
  title = "Before You Go!",
  description = "Subscribe to our newsletter to get the latest updates and exclusive content.",
  ctaText = "Subscribe Now",
  ctaUrl = "#",
  newsletterEnabled = true,
}: ExitIntentPopupProps) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // Check if the popup has been shown in this session
    const hasShown = sessionStorage.getItem("exitPopupShown")
    if (hasShown) return

    let timer: NodeJS.Timeout
    let showPopup = false

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger when the mouse leaves from the top of the page
      if (e.clientY <= 0 && !showPopup) {
        showPopup = true
        timer = setTimeout(() => {
          setOpen(true)
          // Mark as shown in this session
          sessionStorage.setItem("exitPopupShown", "true")
        }, 500)
      }
    }

    // Add event listener
    document.addEventListener("mouseleave", handleMouseLeave)

    // Clean up
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave)
      clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setSubmitting(true)
    try {
      await newsletterAPI.subscribe(email)
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      })
      setOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">{title}</DialogTitle>
          <DialogDescription className="text-base">{description}</DialogDescription>
          <Button variant="ghost" size="icon" className="absolute right-4 top-4" onClick={() => setOpen(false)}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </DialogHeader>

        {newsletterEnabled && (
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Subscribing..." : ctaText}
              </Button>
            </DialogFooter>
          </form>
        )}

        {!newsletterEnabled && (
          <DialogFooter className="pt-4">
            <Button asChild className="w-full">
              <a href={ctaUrl}>{ctaText}</a>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
