"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { loadStripe } from "@stripe/stripe-js"
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js"

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "")

interface StripePaymentFormProps {
  clientSecret: string
  onSuccess: (paymentIntent: any) => void
  onError: (error: any) => void
}

function StripePaymentForm({ clientSecret, onSuccess, onError }: StripePaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardError, setCardError] = useState("")
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setCardError("")

    try {
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      })

      if (error) {
        setCardError(error.message || "An error occurred with your payment")
        onError(error)
      } else if (paymentIntent.status === "succeeded") {
        toast({
          title: "Payment successful",
          description: "Your payment has been processed successfully",
        })
        onSuccess(paymentIntent)
      } else {
        setCardError(`Payment status: ${paymentIntent.status}. Please try again.`)
        onError(new Error(`Payment status: ${paymentIntent.status}`))
      }
    } catch (error) {
      console.error("Stripe payment error:", error)
      setCardError("An unexpected error occurred. Please try again.")
      onError(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-md">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
      </div>

      {cardError && <div className="text-sm text-red-500">{cardError}</div>}

      <Button type="submit" disabled={!stripe || isProcessing} className="w-full">
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay with Card"
        )}
      </Button>
    </form>
  )
}

interface StripePaymentProps {
  productId?: string
  planId?: string
  planName?: string
  planPrice?: number
  price: number
  onSuccess: (data: any) => void
  onError: (error: any) => void
}

export default function StripePayment({
  productId,
  planId,
  planName,
  planPrice,
  price,
  onSuccess,
  onError,
}: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        setIsLoading(true)

        // Determine if this is a product or subscription payment
        const isProduct = !!productId

        if (isProduct) {
          // Create a payment intent for the product
          const response = await fetch("/api/payments/stripe/create-intent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ productId }),
          })

          if (!response.ok) {
            throw new Error("Failed to create payment intent")
          }

          const data = await response.json()
          setClientSecret(data.clientSecret)
        } else {
          // For subscriptions, we'll use Checkout Sessions instead
          // This is just a placeholder for the UI
          setClientSecret("dummy_secret_for_subscription")
        }
      } catch (error) {
        console.error("Error fetching payment intent:", error)
        toast({
          title: "Error",
          description: "Failed to initialize payment",
          variant: "destructive",
        })
        onError(error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentIntent()
  }, [productId, planId, toast, onError])

  const handleCheckoutRedirect = async () => {
    try {
      setIsLoading(true)

      // Create a checkout session for the subscription
      const response = await fetch("/api/payments/stripe/create-subscription-checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          planId,
          planName,
          planPrice,
          interval: "month", // or "year" depending on the plan
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create checkout session")
      }

      const data = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = data.url
    } catch (error) {
      console.error("Error creating checkout session:", error)
      toast({
        title: "Error",
        description: "Failed to initialize checkout",
        variant: "destructive",
      })
      onError(error)
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  // For subscriptions, show a button that redirects to Stripe Checkout
  if (planId) {
    return (
      <Button onClick={handleCheckoutRedirect} className="w-full">
        Subscribe with Stripe
      </Button>
    )
  }

  // For one-time payments, show the card form
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <StripePaymentForm clientSecret={clientSecret} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}
