"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import PaymentForm from "@/components/payment/payment-form"

interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  popular?: boolean
}

interface SubscriptionPlansProps {
  onSuccess?: () => void
}

const plans: Plan[] = [
  {
    id: "basic",
    name: "Basic",
    description: "Perfect for getting started",
    price: 9.99,
    currency: "USD",
    features: [
      "Access to basic content",
      "Email support",
      "Basic analytics",
      "1 user account",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "Best for professionals",
    price: 19.99,
    currency: "USD",
    features: [
      "Everything in Basic",
      "Priority support",
      "Advanced analytics",
      "5 user accounts",
      "Custom branding",
    ],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large organizations",
    price: 49.99,
    currency: "USD",
    features: [
      "Everything in Pro",
      "24/7 support",
      "Custom integrations",
      "Unlimited user accounts",
      "Dedicated account manager",
      "SLA guarantee",
    ],
  },
]

export default function SubscriptionPlans({ onSuccess }: SubscriptionPlansProps) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)

  const handleSubscribe = (plan: Plan) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive",
      })
      return
    }
    setSelectedPlan(plan)
  }

  const handlePaymentSuccess = (data: any) => {
    toast({
      title: "Subscription successful",
      description: "Thank you for subscribing to our service",
    })
    setSelectedPlan(null)
    onSuccess?.()
  }

  const handlePaymentError = (error: any) => {
    console.error("Payment error:", error)
    setSelectedPlan(null)
  }

  if (selectedPlan) {
    return (
      <div className="max-w-2xl mx-auto">
        <PaymentForm
          planId={selectedPlan.id}
          planName={selectedPlan.name}
          planPrice={selectedPlan.price}
          price={selectedPlan.price}
          onSuccess={handlePaymentSuccess}
          onError={handlePaymentError}
        />
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {plans.map((plan) => (
        <Card
          key={plan.id}
          className={`flex flex-col ${
            plan.popular ? "border-primary shadow-lg" : ""
          }`}
        >
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="mb-4">
              <span className="text-3xl font-bold">
                {plan.currency} {plan.price}
              </span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-2">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              variant={plan.popular ? "default" : "outline"}
              onClick={() => handleSubscribe(plan)}
            >
              Subscribe
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
