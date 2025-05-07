"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Loader2, Mail } from "lucide-react"
import { cn } from "@/lib/utils"

interface NewsletterSubscriptionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  compact?: boolean
}

export function NewsletterSubscription({
  title = "Subscribe to our newsletter",
  description = "Get the latest posts delivered right to your inbox",
  compact = false,
  className,
  ...props
}: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [subscribed, setSubscribed] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    try {
      setLoading(true)
      setError(null)

      // This would connect to your newsletter service API
      // For now, we'll simulate a successful subscription
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubscribed(true)
    } catch (err) {
      setError("Failed to subscribe. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (compact) {
    return (
      <div className={cn("w-full", className)} {...props}>
        <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading || subscribed}
            required
            className="flex-1"
          />
          <Button type="submit" disabled={loading || subscribed}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : subscribed ? (
              <Check className="h-4 w-4" />
            ) : (
              "Subscribe"
            )}
          </Button>
        </form>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        {subscribed && <p className="text-sm text-green-500 mt-1">Thanks for subscribing!</p>}
      </div>
    )
  }

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || subscribed}
              required
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" onClick={handleSubmit} disabled={loading || subscribed} className="w-full">
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subscribing...
            </>
          ) : subscribed ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Subscribed!
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Subscribe
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
