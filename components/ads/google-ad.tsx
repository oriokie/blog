"use client"

import { useEffect, useState } from "react"
import Script from "next/script"

interface GoogleAdProps {
  slot: string
  format?: "auto" | "rectangle" | "horizontal" | "vertical"
  responsive?: boolean
  className?: string
}

export function GoogleAd({ slot, format = "auto", responsive = true, className = "" }: GoogleAdProps) {
  const [adClient, setAdClient] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [adEnabled, setAdEnabled] = useState(false)

  useEffect(() => {
    // Fetch ad settings from API
    const fetchAdSettings = async () => {
      try {
        const response = await fetch("/api/settings")
        const data = await response.json()

        if (data.success && data.data.googleAdClient) {
          setAdClient(data.data.googleAdClient)
          setAdEnabled(true)
        } else {
          console.log("Google Ad Client ID not found in settings")
          setAdEnabled(false)
        }

        setIsLoaded(true)
      } catch (error) {
        console.error("Error fetching ad settings:", error)
        setAdEnabled(false)
        setIsLoaded(true)
      }
    }

    fetchAdSettings()
  }, [])

  // If ads are not enabled or client ID is not available, render nothing
  if (!isLoaded || !adEnabled || !adClient) {
    return null
  }

  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adClient}`}
        crossOrigin="anonymous"
        strategy="lazyOnload"
      />
      <div className={`ad-container ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={adClient}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={responsive ? "true" : "false"}
        />
        <Script id={`ad-${slot}`} strategy="lazyOnload">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
      </div>
    </>
  )
}
