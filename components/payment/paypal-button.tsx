"use client"

import { useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface PayPalButtonProps {
  planId: string
  planName: string
  planPrice: number
  price: number
  onSuccess: (data: any) => void
  onError: (error: any) => void
}

declare global {
  interface Window {
    paypal?: {
      Buttons: {
        driver: (options: any) => any
      }
    }
  }
}

export default function PayPalButton({
  planId,
  planName,
  planPrice,
  price,
  onSuccess,
  onError,
}: PayPalButtonProps) {
  const { toast } = useToast()

  useEffect(() => {
    if (typeof window !== "undefined" && window.paypal) {
      const button = window.paypal.Buttons.driver({
        style: {
          layout: "vertical",
          color: "blue",
          shape: "rect",
          label: "pay",
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                description: `${planName} Subscription`,
                amount: {
                  currency_code: "USD",
                  value: price.toString(),
                },
              },
            ],
          })
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const order = await actions.order.capture()
            onSuccess(order)
          } catch (error) {
            onError(error)
          }
        },
        onError: (err: any) => {
          onError(err)
        },
      })

      button.render("#paypal-button-container")
    }
  }, [planId, planName, planPrice, price, onSuccess, onError])

  return (
    <div className="space-y-4">
      <div id="paypal-button-container" />
      <p className="text-sm text-muted-foreground text-center">
        You will be redirected to PayPal to complete your payment
      </p>
    </div>
  )
}
