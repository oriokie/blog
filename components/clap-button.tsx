"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ClapButtonProps {
  postId: string
  initialClaps: number
  userClaps: number
  disabled?: boolean
}

export function ClapButton({ postId, initialClaps = 0, userClaps = 0, disabled = false }: ClapButtonProps) {
  const { user } = useAuth()
  const [claps, setClaps] = useState(initialClaps)
  const [userClapCount, setUserClapCount] = useState(userClaps)
  const [isClapping, setIsClapping] = useState(false)
  const [clapParticles, setClapParticles] = useState<{ id: number; x: number; y: number }[]>([])
  const [particleId, setParticleId] = useState(0)

  const isMaxClaps = userClapCount >= 50

  useEffect(() => {
    setClaps(initialClaps)
    setUserClapCount(userClaps)
  }, [initialClaps, userClaps])

  const handleClap = async () => {
    if (!user || disabled || isMaxClaps) return

    // Add clap particle animation
    const newParticle = {
      id: particleId,
      x: Math.random() * 60 - 30, // Random x offset
      y: -40 - Math.random() * 20, // Random y offset upward
    }

    setClapParticles((prev) => [...prev, newParticle])
    setParticleId((prev) => prev + 1)

    // Remove particle after animation completes
    setTimeout(() => {
      setClapParticles((prev) => prev.filter((p) => p.id !== newParticle.id))
    }, 700)

    // Optimistic update
    setClaps((prev) => prev + 1)
    setUserClapCount((prev) => prev + 1)

    try {
      const response = await fetch(`/api/posts/${postId}/clap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ count: 1 }),
      })

      if (!response.ok) {
        // Revert on error
        setClaps((prev) => prev - 1)
        setUserClapCount((prev) => prev - 1)
        throw new Error("Failed to clap")
      }

      const data = await response.json()
      setClaps(data.claps)
      setUserClapCount(data.userClaps)
    } catch (error) {
      console.error("Error clapping for post:", error)
    }
  }

  const handleMouseDown = () => {
    if (!user || disabled || isMaxClaps) return
    setIsClapping(true)
  }

  const handleMouseUp = () => {
    setIsClapping(false)
  }

  return (
    <div className="relative flex flex-col items-center">
      <AnimatePresence>
        {clapParticles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            animate={{ opacity: 0, scale: 0.5, x: particle.x, y: particle.y }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute text-sm font-bold text-primary"
          >
            +1
          </motion.div>
        ))}
      </AnimatePresence>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={`rounded-full p-2 ${isClapping ? "bg-primary/20" : ""} ${
                isMaxClaps ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleClap}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              disabled={!user || disabled || isMaxClaps}
            >
              <motion.div animate={{ scale: isClapping ? 1.2 : 1 }} transition={{ duration: 0.1 }}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={userClapCount > 0 ? "fill-primary text-primary" : ""}
                >
                  <path d="M11 15H8.8c-1.3 0-2.4-.8-2.8-2 0 0 0-.1-.1-.1-.3-1-.1-2.1.7-2.9l7.6-7.6c.7-.7 1.8-.7 2.5 0s.7 1.8 0 2.5L13 8.5" />
                  <path d="M14 14.5c-.5-1.7.1-3.3 1.6-4.1.2-.1.5-.2.8-.2h.1c1.8-.7 3.9 0 4.9 1.5 1.1 1.8.2 4.1-1.8 4.8-.5.2-1.1.2-1.6.1-.5-.1-1-.4-1.4-.8" />
                  <path d="M12 16.5c-.5-1.7.1-3.3 1.6-4.1.2-.1.5-.2.8-.2h.1c1.8-.7 3.9 0 4.9 1.5" />
                  <path d="M16 11.5c.5-.3 1-.5 1.5-.5h.1c1.8-.7 3.9 0 4.9 1.5M5 10.5c-.5 0-1.1.1-1.6.4-1.9.7-2.8 3-1.7 4.8.9 1.5 3 2.2 4.8 1.5.2-.1.4-.1.6-.2" />
                  <path d="M8.8 15H11v4.3a1.7 1.7 0 0 1-3.4 0V17" />
                </svg>
              </motion.div>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {!user
              ? "Sign in to clap"
              : isMaxClaps
                ? "You reached the maximum of 50 claps"
                : `Clap for this post (${userClapCount}/50)`}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <span className="text-sm text-muted-foreground mt-1">{claps}</span>
    </div>
  )
}
