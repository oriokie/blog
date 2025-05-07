"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { sponsoredContentAPI } from "@/lib/api"

interface SponsoredCardProps {
  content: any
  className?: string
  variant?: "default" | "compact" | "sidebar"
}

export function SponsoredCard({ content, className = "", variant = "default" }: SponsoredCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    // Track view when component mounts
    sponsoredContentAPI.trackView(content._id)
  }, [content._id])

  const handleClick = async () => {
    // Track click when user clicks on the card
    await sponsoredContentAPI.trackClick(content._id)
  }

  if (variant === "compact") {
    return (
      <Card
        className={`overflow-hidden transition-all duration-300 ${className} ${isHovered ? "shadow-lg" : "shadow-md"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <Link href={content.sponsor.website} target="_blank" rel="noopener noreferrer">
          <div className="flex items-center p-3 space-x-3">
            <div className="relative h-10 w-10 flex-shrink-0">
              <Image
                src={content.sponsor.logo || "/placeholder.svg?height=40&width=40"}
                alt={content.sponsor.name}
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{content.title}</p>
              <p className="text-xs text-gray-500">
                Sponsored by {content.sponsor.name} <ExternalLink className="inline h-3 w-3" />
              </p>
            </div>
          </div>
        </Link>
      </Card>
    )
  }

  if (variant === "sidebar") {
    return (
      <Card
        className={`overflow-hidden transition-all duration-300 ${className} ${isHovered ? "shadow-lg" : "shadow-md"}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        <Link href={content.sponsor.website} target="_blank" rel="noopener noreferrer">
          <div className="relative h-40 w-full">
            <Image
              src={content.coverImage || "/placeholder.svg?height=160&width=300"}
              alt={content.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded-full">
              Sponsored
            </div>
          </div>
          <CardContent className="p-3">
            <h3 className="font-medium text-sm mb-1">{content.title}</h3>
            <p className="text-xs text-gray-500 flex items-center">
              By {content.sponsor.name} <ExternalLink className="ml-1 h-3 w-3" />
            </p>
          </CardContent>
        </Link>
      </Card>
    )
  }

  // Default variant
  return (
    <Card
      className={`overflow-hidden transition-all duration-300 ${className} ${isHovered ? "shadow-lg" : "shadow-md"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image
            src={content.coverImage || "/placeholder.svg?height=192&width=384"}
            alt={content.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-xs px-2 py-1 rounded-full">Sponsored</div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="relative h-6 w-6 mr-2">
            <Image
              src={content.sponsor.logo || "/placeholder.svg?height=24&width=24"}
              alt={content.sponsor.name}
              fill
              className="object-contain rounded-full"
            />
          </div>
          <span className="text-xs text-gray-500">Sponsored by {content.sponsor.name}</span>
        </div>
        <h3 className="font-bold text-lg mb-2">{content.title}</h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{content.excerpt}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" size="sm" className="w-full" onClick={handleClick} asChild>
          <Link href={content.sponsor.website} target="_blank" rel="noopener noreferrer">
            Learn More <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
