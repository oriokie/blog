"use client"

import { useState, useEffect } from "react"
import { SponsoredCard } from "./sponsored-card"
import { sponsoredContentAPI } from "@/lib/api"

interface SponsoredSectionProps {
  placement: string
  title?: string
  limit?: number
  categories?: string[]
  tags?: string[]
  variant?: "default" | "compact" | "sidebar"
  className?: string
}

export function SponsoredSection({
  placement,
  title = "Sponsored Content",
  limit = 3,
  categories,
  tags,
  variant = "default",
  className = "",
}: SponsoredSectionProps) {
  const [sponsoredContent, setSponsoredContent] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchSponsoredContent = async () => {
      try {
        setIsLoading(true)
        const response = await sponsoredContentAPI.getForPlacement(placement, {
          limit,
          categories,
          tags,
        })
        setSponsoredContent(response.data)
      } catch (error) {
        console.error("Error fetching sponsored content:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSponsoredContent()
  }, [placement, limit, categories, tags])

  if (isLoading) {
    return (
      <div className={className}>
        <h3 className="text-lg font-semibold mb-4">{title}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array(limit)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="h-64 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg"></div>
            ))}
        </div>
      </div>
    )
  }

  if (sponsoredContent.length === 0) {
    return null
  }

  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div
        className={`grid gap-4 ${
          variant === "compact"
            ? "grid-cols-1"
            : variant === "sidebar"
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        }`}
      >
        {sponsoredContent.map((content) => (
          <SponsoredCard key={content._id} content={content} variant={variant} />
        ))}
      </div>
    </div>
  )
}
