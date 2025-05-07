"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SubscriptionPlans from "@/components/subscription/subscription-plans"
import { SubscriptionStatus } from "@/components/subscription/subscription-status"
import { subscriptionAPI } from "@/lib/api"
import { useAuth } from "@/contexts/auth-context"

export default function SubscriptionPage() {
  const [hasSubscription, setHasSubscription] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const checkSubscription = async () => {
      if (!user) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const response = await subscriptionAPI.getUserSubscription()
        setHasSubscription(!!response.data?._id)
      } catch (error) {
        console.error("Error checking subscription:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSubscription()
  }, [user])

  if (!user && !isLoading) {
    router.push("/login?redirect=/subscription")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Subscription</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Upgrade your experience with an ad-free subscription and premium content access.
        </p>

        <Tabs defaultValue={hasSubscription ? "status" : "plans"}>
          <TabsList className="mb-8">
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
            <TabsTrigger value="status">Subscription Status</TabsTrigger>
          </TabsList>
          <TabsContent value="plans">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Choose a Plan</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                All plans include ad-free browsing. Yearly and lifetime plans include access to premium content and
                early access to new features.
              </p>
              <SubscriptionPlans
                onSuccess={() => {
                  setHasSubscription(true)
                  router.push("/subscription?tab=status")
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value="status">
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Your Subscription</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Manage your current subscription and payment details.
              </p>
              <SubscriptionStatus
                onCancelled={() => {
                  setHasSubscription(false)
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-bold mb-4">Subscription FAQ</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-1">What's included in the subscription?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                All subscriptions include ad-free browsing across the entire site. Yearly and lifetime plans also
                include access to premium content and early access to new features.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">Can I cancel my subscription?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your
                current billing period.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">How do I change my payment method?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                You can update your payment method in the Subscription Status tab. Click on "Manage Payment Method" to
                make changes.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-1">What happens after I subscribe?</h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                After subscribing, you'll immediately get access to ad-free browsing and any other features included in
                your plan. Your subscription will automatically renew unless you cancel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
