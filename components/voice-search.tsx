"use client"

import { useState, useEffect } from "react"
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export function VoiceSearch() {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [supported, setSupported] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setSupported(false)
    }
  }, [])

  const startListening = () => {
    setTranscript("")
    setIsListening(true)

    // Use the appropriate SpeechRecognition constructor
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US"

    recognition.onresult = (event) => {
      const current = event.resultIndex
      const result = event.results[current]
      const transcript = result[0].transcript
      setTranscript(transcript)
    }

    recognition.onend = () => {
      setIsListening(false)
      if (transcript) {
        // Navigate to search page with the transcript as query
        router.push(`/search?q=${encodeURIComponent(transcript)}`)
      }
    }

    recognition.start()
  }

  const stopListening = () => {
    setIsListening(false)
    // The recognition.onend handler will be called automatically
  }

  if (!supported) {
    return null // Don't render if not supported
  }

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full"
        onClick={isListening ? stopListening : startListening}
        aria-label={isListening ? "Stop voice search" : "Start voice search"}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>
      {transcript && <span className="text-sm text-gray-600 dark:text-gray-300">{transcript}</span>}
    </div>
  )
}

export function AudioContent({ content, title }: { content: string; title: string }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    // Check if browser supports SpeechSynthesis
    if (!("speechSynthesis" in window)) {
      setSupported(false)
    }
  }, [])

  const speak = () => {
    if (!supported) return

    if (isPlaying) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    // Create a new SpeechSynthesisUtterance
    const utterance = new SpeechSynthesisUtterance()

    // Strip HTML tags from content
    const textContent = content.replace(/<[^>]*>/g, "")

    utterance.text = `${title}. ${textContent}`
    utterance.lang = "en-US"
    utterance.rate = 1.0
    utterance.pitch = 1.0

    utterance.onend = () => {
      setIsPlaying(false)
    }

    window.speechSynthesis.speak(utterance)
    setIsPlaying(true)
  }

  if (!supported) {
    return null // Don't render if not supported
  }

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center space-x-2"
      onClick={speak}
      aria-label={isPlaying ? "Stop audio" : "Listen to article"}
    >
      {isPlaying ? <VolumeX className="h-4 w-4 mr-2" /> : <Volume2 className="h-4 w-4 mr-2" />}
      <span>{isPlaying ? "Stop Audio" : "Listen to Article"}</span>
    </Button>
  )
}
