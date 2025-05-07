"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import DashboardHeader from "@/components/dashboard/header"
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (isMounted && !loading && !user) {
      router.push("/login?redirect=" + encodeURIComponent(pathname || "/dashboard"))
    }
  }, [isMounted, loading, user, router, pathname])

  if (!isMounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r md:block" />
      <div className="flex-1 md:pl-64">
        <DashboardHeader onOpenSidebar={() => setIsSidebarOpen(true)} />
        <main className="min-h-screen">
          <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
