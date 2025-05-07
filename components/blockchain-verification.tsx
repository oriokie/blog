"use client"

import { useState } from "react"
import { Shield, ShieldCheck, ShieldX, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface BlockchainVerificationProps {
  contentId: string
  timestamp: string
  author: string
}

export function BlockchainVerification({ contentId, timestamp, author }: BlockchainVerificationProps) {
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "verified" | "failed">("pending")
  const [verifying, setVerifying] = useState(false)

  const verifyContent = async () => {
    setVerifying(true)

    try {
      // In a real implementation, this would call a blockchain verification service
      // For demo purposes, we'll simulate a verification process
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful verification 90% of the time
      const isVerified = Math.random() > 0.1
      setVerificationStatus(isVerified ? "verified" : "failed")
    } catch (error) {
      console.error("Error verifying content:", error)
      setVerificationStatus("failed")
    } finally {
      setVerifying(false)
    }
  }

  const getIcon = () => {
    switch (verificationStatus) {
      case "pending":
        return <Shield className="h-5 w-5" />
      case "verified":
        return <ShieldCheck className="h-5 w-5 text-green-500" />
      case "failed":
        return <ShieldX className="h-5 w-5 text-red-500" />
    }
  }

  const getTooltipText = () => {
    switch (verificationStatus) {
      case "pending":
        return "Verify content authenticity on blockchain"
      case "verified":
        return `Content verified on blockchain. Published by ${author} on ${new Date(timestamp).toLocaleString()}`
      case "failed":
        return "Content verification failed. The content may have been modified."
    }
  }

  const getButtonText = () => {
    switch (verificationStatus) {
      case "pending":
        return "Verify Authenticity"
      case "verified":
        return "Verified Content"
      case "failed":
        return "Verification Failed"
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
            onClick={verificationStatus === "pending" ? verifyContent : undefined}
            disabled={verifying}
          >
            {verifying ? (
              <div className="h-4 w-4 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin mr-2"></div>
            ) : (
              getIcon()
            )}
            <span>{verifying ? "Verifying..." : getButtonText()}</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipText()}</p>
          {verificationStatus === "verified" && (
            <div className="flex items-center mt-2 text-xs">
              <a
                href={`https://example-blockchain-explorer.com/content/${contentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-blue-500 hover:underline"
              >
                View on Blockchain <ExternalLink className="h-3 w-3 ml-1" />
              </a>
            </div>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
