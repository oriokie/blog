"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import MpesaPaymentForm from "./mpesa-payment-form"
import PayPalButton from "./paypal-button"

interface PaymentFormProps {
  planId: string
  planName: string
  planPrice: number
  price: number
  onSuccess: (data: any) => void
  onError: (error: any) => void
}

export default function PaymentForm({
  planId,
  planName,
  planPrice,
  price,
  onSuccess,
  onError,
}: PaymentFormProps) {
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("mpesa")

  const handleMpesaSuccess = (data: any) => {
    toast({
      title: "Payment initiated",
      description: "Please check your phone for the M-Pesa prompt",
    })
    onSuccess(data)
  }

  const handleMpesaError = (error: any) => {
    toast({
      title: "Payment failed",
      description: "There was an error processing your M-Pesa payment",
      variant: "destructive",
    })
    onError(error)
  }

  const handlePayPalSuccess = (data: any) => {
    toast({
      title: "Payment successful",
      description: "Your PayPal payment has been processed successfully",
    })
    onSuccess(data)
  }

  const handlePayPalError = (error: any) => {
    toast({
      title: "Payment failed",
      description: "There was an error processing your PayPal payment",
      variant: "destructive",
    })
    onError(error)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>
          Choose your preferred payment method to complete your subscription
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="mpesa">M-Pesa</TabsTrigger>
            <TabsTrigger value="paypal">PayPal</TabsTrigger>
          </TabsList>
          <TabsContent value="mpesa">
            <MpesaPaymentForm
              amount={price}
              onSuccess={handleMpesaSuccess}
              onError={handleMpesaError}
            />
          </TabsContent>
          <TabsContent value="paypal">
            <PayPalButton
              planId={planId}
              planName={planName}
              planPrice={planPrice}
              price={price}
              onSuccess={handlePayPalSuccess}
              onError={handlePayPalError}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 