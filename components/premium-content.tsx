"use client"

import type React from "react"

import { useState } from "react"
import { Micropayment } from "@/components/micropayment"

interface PremiumContentProps {
  contentId: string
  title: string
  price: number
  currency?: string
  previewLines?: number
  children: React.ReactNode
}

export function PremiumContent({
  contentId,
  title,
  price,
  currency = "USD",
  previewLines = 3,
  children,
}: PremiumContentProps) {
  const [isSubscribed, setIsSubscribed] = useState(false)

  // Check if user is subscribed
  // This would typically be fetched from an API
  // For demo purposes, we'll just use a state variable

  // Split content into preview and hidden parts
  const content = children?.toString() || ""
  const contentArray = content.split("\n").filter((line) => line.trim() !== "")

  const previewContent = (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {contentArray.slice(0, previewLines).map((line, index) => (
        <p key={index}>{line}</p>
      ))}
      <p className="text-sm text-gray-500 italic">This is premium content. Subscribe or pay to continue reading...</p>
    </div>
  )

  if (isSubscribed) {
    return <>{children}</>
  }

  return (
    <Micropayment contentId={contentId} price={price} currency={currency} title={title} previewContent={previewContent}>
      {children}
    </Micropayment>
  )
}
