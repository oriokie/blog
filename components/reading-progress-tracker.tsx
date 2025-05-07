"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

interface ReadingProgressTrackerProps {
  postId: string
}

export function ReadingProgressTracker({ postId }: ReadingProgressTrackerProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [timeSpent, setTimeSpent] = useState(0)
  const [isTracking, setIsTracking] = useState(false)

  useEffect(() => {
    if (!user || !postId) return

    // Initialize tracking
    const initializeTracking = async () => {
      try {
        // Fetch existing reading progress if any
        const response = await fetch(`/api/reading-history/${postId}`)
        if (response.ok) {
          const data = await response.json()
          setProgress(data.progress || 0)
          setTimeSpent(data.timeSpent || 0)
        }

        setStartTime(Date.now())
        setIsTracking(true)
      } catch (error) {
        console.error("Error initializing reading tracking:", error)
      }
    }

    initializeTracking()

    // Set up scroll tracking
    const handleScroll = () => {
      if (!isTracking) return

      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY

      // Calculate reading progress as percentage
      const currentProgress = Math.min(Math.round((scrollTop / (documentHeight - windowHeight)) * 100), 100)

      setProgress(currentProgress)
    }

    window.addEventListener("scroll", handleScroll)

    // Set up interval to track time spent
    const timeInterval = setInterval(() => {
      if (isTracking && startTime) {
        setTimeSpent((prev) => prev + 1)
      }
    }, 1000)

    // Save progress when user leaves
    const saveProgress = async () => {
      if (!isTracking || !user) return

      try {
        await fetch(`/api/reading-history/${postId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            progress,
            timeSpent,
            completed: progress >= 90, // Consider as completed if 90% read
          }),
        })
      } catch (error) {
        console.error("Error saving reading progress:", error)
      }
    }

    window.addEventListener("beforeunload", saveProgress)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("beforeunload", saveProgress)
      clearInterval(timeInterval)
      saveProgress()
    }
  }, [user, postId, isTracking, progress, timeSpent, startTime])

  return null // This is a tracking component with no UI
}
