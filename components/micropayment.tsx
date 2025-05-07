"use client"

import type React from "react"

import { useState } from "react"
import { Lock, CreditCard, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { mpesaAPI } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface MicropaymentProps {
  contentId: string
  price: number
  currency?: string
  title: string
  children: React.ReactNode
  previewContent?: React.ReactNode
}

export function Micropayment({
  contentId,
  price,
  currency = "USD",
  title,
  children,
  previewContent,
}: MicropaymentProps) {
  const [unlocked, setUnlocked] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto" | "wallet" | "paypal" | "mpesa">("card")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [checkingStatus, setCheckingStatus] = useState(false)
  const [checkoutRequestID, setCheckoutRequestID] = useState("")
  const { toast } = useToast()

  const processPayment = async () => {
    setProcessing(true)

    try {
      if (paymentMethod === "mpesa") {
        // Process M-Pesa payment
        if (!phoneNumber || phoneNumber.length < 10) {
          toast({
            title: "Invalid phone number",
            description: "Please enter a valid phone number",
            variant: "destructive",
          })
          setProcessing(false)
          return
        }

        const { data } = await mpesaAPI.initiatePayment(
          phoneNumber,
          price,
          `Premium-${contentId}`,
          `Payment for ${title}`,
        )

        if (data.success) {
          setCheckoutRequestID(data.CheckoutRequestID)
          toast({
            title: "Payment initiated",
            description: "Please check your phone and enter your M-Pesa PIN to complete payment",
          })

          // Start polling for payment status
          pollPaymentStatus(data.CheckoutRequestID)
        } else {
          toast({
            title: "Payment failed",
            description: data.message || "Failed to initiate M-Pesa payment",
            variant: "destructive",
          })
        }
      } else {
        // Simulate other payment methods
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setUnlocked(true)
      }
    } catch (error) {
      console.error("Error processing payment:", error)
      toast({
        title: "Payment failed",
        description: "An error occurred while processing your payment",
        variant: "destructive",
      })
    } finally {
      if (paymentMethod !== "mpesa") {
        setProcessing(false)
      }
    }
  }

  const pollPaymentStatus = async (requestId: string) => {
    setCheckingStatus(true)
    let attempts = 0
    const maxAttempts = 10

    const checkStatus = async () => {
      try {
        const { data } = await mpesaAPI.checkStatus(requestId)

        if (data.success && data.status === "COMPLETED") {
          setUnlocked(true)
          setProcessing(false)
          setCheckingStatus(false)
          toast({
            title: "Payment successful",
            description: "Thank you for your payment. Enjoy the content!",
          })
          return true
        } else if (data.status === "FAILED") {
          toast({
            title: "Payment failed",
            description: data.message || "M-Pesa payment was not completed",
            variant: "destructive",
          })
          setProcessing(false)
          setCheckingStatus(false)
          return true
        }
      } catch (error) {
        console.error("Error checking payment status:", error)
      }

      attempts++
      if (attempts >= maxAttempts) {
        toast({
          title: "Payment status unknown",
          description: "We couldn't confirm your payment. If you completed the payment, please contact support.",
          variant: "destructive",
        })
        setProcessing(false)
        setCheckingStatus(false)
        return true
      }

      return false
    }

    // Initial check
    const completed = await checkStatus()
    if (!completed) {
      // Set up polling every 5 seconds
      const interval = setInterval(async () => {
        const completed = await checkStatus()
        if (completed) {
          clearInterval(interval)
        }
      }, 5000)
    }
  }

  if (unlocked) {
    return <>{children}</>
  }

  return (
    <Dialog>
      <div className="relative">
        {previewContent && <div className="mb-4">{previewContent}</div>}
        <div className="absolute inset-0 backdrop-blur-sm bg-gray-900/30 flex items-center justify-center rounded-lg">
          <DialogTrigger asChild>
            <Button className="flex items-center space-x-2">
              <Lock className="h-4 w-4 mr-2" />
              <span>
                Unlock for {price} {currency}
              </span>
            </Button>
          </DialogTrigger>
        </div>
        <div className="opacity-20 pointer-events-none">{children}</div>
      </div>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Unlock Premium Content</DialogTitle>
          <DialogDescription>Pay a small fee to access "{title}" and support the author.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex justify-between items-center">
            <span>Price:</span>
            <span className="font-bold">
              {price} {currency}
            </span>
          </div>

          <div className="grid grid-cols-5 gap-2">
            <Button variant={paymentMethod === "card" ? "default" : "outline"} onClick={() => setPaymentMethod("card")}>
              Credit Card
            </Button>
            <Button
              variant={paymentMethod === "crypto" ? "default" : "outline"}
              onClick={() => setPaymentMethod("crypto")}
            >
              Crypto
            </Button>
            <Button
              variant={paymentMethod === "wallet" ? "default" : "outline"}
              onClick={() => setPaymentMethod("wallet")}
            >
              Wallet
            </Button>
            <Button
              variant={paymentMethod === "paypal" ? "default" : "outline"}
              onClick={() => setPaymentMethod("paypal")}
            >
              PayPal
            </Button>
            <Button
              variant={paymentMethod === "mpesa" ? "default" : "outline"}
              onClick={() => setPaymentMethod("mpesa")}
            >
              M-Pesa
            </Button>
          </div>

          {paymentMethod === "card" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
            </>
          )}

          {paymentMethod === "crypto" && (
            <div className="grid gap-2">
              <Label htmlFor="wallet-address">Wallet Address</Label>
              <Input id="wallet-address" value="0x1234...5678" readOnly />
              <p className="text-sm text-gray-500">
                Send {price} {currency === "USD" ? "USDC" : currency} to the address above.
              </p>
            </div>
          )}

          {paymentMethod === "wallet" && (
            <div className="grid gap-2">
              <p className="text-sm text-gray-500">Connect your digital wallet to make a payment.</p>
              <Button variant="outline" className="w-full">
                Connect Wallet
              </Button>
            </div>
          )}

          {paymentMethod === "paypal" && (
            <div className="grid gap-2">
              <p className="text-sm text-gray-500">Click the button below to pay with PayPal.</p>
              <Button variant="outline" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                <span className="font-bold">Pay</span>
                <span className="font-bold text-blue-300">Pal</span>
              </Button>
              <p className="text-xs text-gray-500 text-center">
                You will be redirected to PayPal to complete your payment.
              </p>
            </div>
          )}

          {paymentMethod === "mpesa" && (
            <div className="grid gap-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <Input
                id="phone-number"
                placeholder="e.g., 254712345678"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Enter your M-Pesa registered phone number. You will receive a prompt to enter your PIN.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={processPayment} disabled={processing || checkingStatus}>
            {processing ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                {checkingStatus ? "Checking payment..." : "Processing..."}
              </>
            ) : (
              <>
                {paymentMethod === "mpesa" ? (
                  <>
                    <Phone className="h-4 w-4 mr-2" />
                    Pay with M-Pesa
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pay {price} {currency}
                  </>
                )}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
