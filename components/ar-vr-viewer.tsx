"use client"

import { useState, useEffect } from "react"
import { CuboidIcon as Cube, Glasses } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface ARVRViewerProps {
  modelUrl?: string
  imageUrl: string
  title: string
}

export function ARVRViewer({ modelUrl, imageUrl, title }: ARVRViewerProps) {
  const [supported, setSupported] = useState(true)
  const [mode, setMode] = useState<"ar" | "vr" | null>(null)

  useEffect(() => {
    // Check if browser supports WebXR
    if (!navigator.xr) {
      setSupported(false)
    }
  }, [])

  const launchAR = async () => {
    try {
      setMode("ar")
      // In a real implementation, this would use the WebXR API
      console.log("Launching AR experience")
    } catch (error) {
      console.error("Error launching AR:", error)
    }
  }

  const launchVR = async () => {
    try {
      setMode("vr")
      // In a real implementation, this would use the WebXR API
      console.log("Launching VR experience")
    } catch (error) {
      console.error("Error launching VR:", error)
    }
  }

  if (!supported) {
    return null // Don't render if not supported
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Cube className="h-4 w-4 mr-2" />
          <span>View in 3D</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>3D Experience: {title}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="relative aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
            {/* This would be a 3D model viewer in a real implementation */}
            <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gray-500 dark:text-gray-400">3D Preview</span>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button onClick={launchAR} className="flex items-center">
              <Cube className="h-4 w-4 mr-2" />
              <span>View in AR</span>
            </Button>
            <Button onClick={launchVR} variant="outline" className="flex items-center">
              <Glasses className="h-4 w-4 mr-2" />
              <span>View in VR</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
