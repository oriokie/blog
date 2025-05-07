"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { subscriptionAPI } from "@/lib/api"

interface SubscriptionStatusProps {
  onCancelled?: () => void
  className?: string
}

export function SubscriptionStatus({ onCancelled, className = "" }: SubscriptionStatusProps) {
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        setIsLoading(true)
        const response = await subscriptionAPI.getUserSubscription()
        setSubscription(response.data)
      } catch (error) {
        console.error("Error fetching subscription:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSubscription()
  }, [])

  const handleCancelSubscription = async () => {
    try {
      setIsCancelling(true)
      await subscriptionAPI.cancel(cancelReason)

      toast({
        title: "Subscription cancelled",
        description: "Your subscription has been cancelled successfully.",
      })

      // Refresh subscription data
      const response = await subscriptionAPI.getUserSubscription()
      setSubscription(response.data)

      setShowCancelDialog(false)

      if (onCancelled) {
        onCancelled()
      }
    } catch (error) {
      console.error("Error cancelling subscription:", error)
      toast({
        title: "Error",
        description: "Failed to cancel your subscription. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsCancelling(false)
    }
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="animate-pulse bg-gray-200 dark:bg-gray-700 h-6 w-48 rounded"></CardTitle>
          <CardDescription className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-32 rounded"></CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-full rounded"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-3/4 rounded"></div>
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-4 w-5/6 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!subscription || !subscription._id) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>No Active Subscription</CardTitle>
          <CardDescription>You don't have an active subscription</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Subscribe to go ad-free</AlertTitle>
            <AlertDescription>
              Subscribe to one of our plans to enjoy an ad-free experience and access premium content.
            </AlertDescription>
          </Alert>
        </CardContent>
        <CardFooter>
          <Button className="w-full" variant="default">
            View Subscription Plans
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Your Subscription</CardTitle>
            <CardDescription>
              {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
            </CardDescription>
          </div>
          <div className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-100 text-xs font-medium rounded-full flex items-center">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Active
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Date</p>
            <p className="text-sm">{format(new Date(subscription.startDate), "MMM d, yyyy")}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Billing Date</p>
            <p className="text-sm">
              {subscription.plan === "lifetime"
                ? "Never (Lifetime)"
                : format(new Date(subscription.renewalDate), "MMM d, yyyy")}
            </p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Features</p>
          <ul className="space-y-1">
            <li className="text-sm flex items-center">
              <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
              Ad-free browsing
            </li>
            {subscription.features.premiumContent && (
              <li className="text-sm flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                Premium content access
              </li>
            )}
            {subscription.features.earlyAccess && (
              <li className="text-sm flex items-center">
                <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                Early access to new features
              </li>
            )}
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Payment Method</p>
          <p className="text-sm">
            {subscription.paymentMethod === "credit_card"
              ? `Credit Card (ending in ${subscription.paymentDetails?.lastFour || "****"})`
              : subscription.paymentMethod.charAt(0).toUpperCase() + subscription.paymentMethod.slice(1)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          Manage Payment Method
        </Button>
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
              Cancel Subscription
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cancel Subscription</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel your subscription? You'll lose access to ad-free browsing and other
                premium features.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Please let us know why you're cancelling so we can improve our service:
              </p>
              <Textarea
                placeholder="Reason for cancellation (optional)"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Keep Subscription
              </Button>
              <Button variant="destructive" onClick={handleCancelSubscription} disabled={isCancelling}>
                {isCancelling ? "Cancelling..." : "Confirm Cancellation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
