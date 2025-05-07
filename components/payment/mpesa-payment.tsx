"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { mpesaAPI } from "@/lib/api"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

interface MpesaPaymentProps {
  amount: number
  onSuccess?: () => void
  onError?: (error: any) => void
  reference?: string
  description?: string
  className?: string
}

export function MpesaPayment({
  amount,
  onSuccess,
  onError,
  reference = "Blog Subscription",
  description = "Payment for subscription",
  className = "",
}: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [checkoutRequestID, setCheckoutRequestID] = useState<string | null>(null)
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "success" | "failed" | null>(null)
  const [statusCheckInterval, setStatusCheckInterval] = useState<NodeJS.Timeout | null>(null)
  const { toast } = useToast()

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numbers and limit to 12 characters
    const value = e.target.value.replace(/[^\d]/g, "").slice(0, 12)
    setPhoneNumber(value)
  }

  const formatPhoneNumber = (phone: string) => {
    // Format for display: 254XXXXXXXXX to 07XX XXX XXX
    if (phone.startsWith("254") && phone.length >= 12) {
      const withoutPrefix = phone.substring(3)
      return `0${withoutPrefix.substring(0, 3)} ${withoutPrefix.substring(3, 6)} ${withoutPrefix.substring(6)}`
    }
    return phone
  }

  const initiatePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 9) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      setPaymentStatus(null)

      const response = await mpesaAPI.initiatePayment(phoneNumber, amount, reference, description)

      if (response.data.success) {
        setCheckoutRequestID(response.data.data.CheckoutRequestID)
        setPaymentStatus("pending")
        toast({
          title: "Payment initiated",
          description: "Please check your phone and enter your M-Pesa PIN to complete the payment",
        })

        // Start checking payment status
        const interval = setInterval(async () => {
          await checkPaymentStatus(response.data.data.CheckoutRequestID)
        }, 5000) // Check every 5 seconds

        setStatusCheckInterval(interval)
      } else {
        throw new Error(response.data.message || "Failed to initiate payment")
      }
    } catch (error) {
      console.error("Error initiating M-Pesa payment:", error)
      toast({
        title: "Payment failed",
        description: "Failed to initiate M-Pesa payment. Please try again.",
        variant: "destructive",
      })
      setPaymentStatus("failed")
      if (onError) onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const checkPaymentStatus = async (requestId: string) => {
    try {
      const response = await mpesaAPI.checkStatus(requestId)

      if (response.data.success) {
        const resultCode = response.data.data.ResultCode

        if (resultCode === 0) {
          // Payment successful
          setPaymentStatus("success")
          clearInterval(statusCheckInterval!)
          setStatusCheckInterval(null)
          toast({
            title: "Payment successful",
            description: "Your M-Pesa payment was successful",
          })
          if (onSuccess) onSuccess()
        } else if (resultCode === 1032) {
          // Transaction canceled
          setPaymentStatus("failed")
          clearInterval(statusCheckInterval!)
          setStatusCheckInterval(null)
          toast({
            title: "Payment canceled",
            description: "The M-Pesa transaction was canceled",
            variant: "destructive",
          })
        }
        // For other result codes, continue checking
      }
    } catch (error) {
      console.error("Error checking payment status:", error)
      // Don't stop checking on error, might be temporary
    }
  }

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (statusCheckInterval) {
        clearInterval(statusCheckInterval)
      }
    }
  }, [statusCheckInterval])

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-medium">Pay with M-Pesa</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter your phone number to receive an M-Pesa payment prompt
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone-number">Phone Number</Label>
        <Input
          id="phone-number"
          placeholder="e.g. 07XX XXX XXX"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
          disabled={isLoading || paymentStatus === "pending" || paymentStatus === "success"}
        />
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter your phone number in the format 07XX XXX XXX or 254XXXXXXXXX
        </p>
      </div>

      <div className="text-center font-medium">Amount: KES {amount.toFixed(2)}</div>

      {paymentStatus === "pending" && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4 text-center">
          <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-yellow-600 dark:text-yellow-400" />
          <p className="text-yellow-800 dark:text-yellow-300 font-medium">Waiting for your payment...</p>
          <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-1">
            Please check your phone and enter your M-Pesa PIN
          </p>
        </div>
      )}

      {paymentStatus === "success" && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md p-4 text-center">
          <CheckCircle className="h-6 w-6 mx-auto mb-2 text-green-600 dark:text-green-400" />
          <p className="text-green-800 dark:text-green-300 font-medium">Payment successful!</p>
          <p className="text-green-600 dark:text-green-400 text-sm mt-1">
            Your payment has been processed successfully
          </p>
        </div>
      )}

      {paymentStatus === "failed" && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 text-center">
          <XCircle className="h-6 w-6 mx-auto mb-2 text-red-600 dark:text-red-400" />
          <p className="text-red-800 dark:text-red-300 font-medium">Payment failed</p>
          <p className="text-red-600 dark:text-red-400 text-sm mt-1">
            The payment process was unsuccessful. Please try again.
          </p>
        </div>
      )}

      <Button
        onClick={initiatePayment}
        disabled={isLoading || !phoneNumber || paymentStatus === "pending" || paymentStatus === "success"}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : paymentStatus === "success" ? (
          "Paid"
        ) : paymentStatus === "pending" ? (
          "Processing..."
        ) : (
          "Pay Now"
        )}
      </Button>
    </div>
  )
}
