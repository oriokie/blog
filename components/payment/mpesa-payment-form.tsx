"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

interface MpesaPaymentFormProps {
  amount: number
  onSuccess: (data: any) => void
  onError: (error: any) => void
}

export default function MpesaPaymentForm({
  amount,
  onSuccess,
  onError,
}: MpesaPaymentFormProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate M-Pesa payment process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, you would call your M-Pesa API here
      const response = {
        success: true,
        checkoutRequestId: "ws_CO_" + Date.now(),
        merchantRequestId: "MR_" + Date.now(),
        responseCode: "0",
        responseDescription: "Success. Request accepted for processing",
        customerMessage: "Please check your phone for the M-Pesa prompt",
      }

      onSuccess(response)
    } catch (error) {
      onError(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phone">M-Pesa Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="e.g., 254712345678"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          required
          pattern="^254[0-9]{9}$"
          title="Please enter a valid M-Pesa phone number starting with 254"
        />
        <p className="text-sm text-muted-foreground">
          Enter the phone number registered with M-Pesa
        </p>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <p className="text-sm font-medium">Amount to Pay</p>
        <p className="text-2xl font-bold">KES {amount.toFixed(2)}</p>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Pay with M-Pesa"
        )}
      </Button>
    </form>
  )
} 