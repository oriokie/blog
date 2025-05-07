"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart,
  FolderOpen,
  ImageIcon,
  Settings,
  Users,
  Plug,
  BrainCircuit,
  FileEdit,
  DollarSign,
  Megaphone,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/contexts/auth-context"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const isAdmin = user?.role === "admin"

  const routes = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      href: "/dashboard",
      variant: "default",
    },
    {
      title: "Posts",
      icon: FileText,
      href: "/dashboard/posts",
      variant: "ghost",
    },
    {
      title: "Comments",
      icon: MessageSquare,
      href: "/dashboard/comments",
      variant: "ghost",
    },
    {
      title: "Analytics",
      icon: BarChart,
      href: "/dashboard/analytics",
      variant: "ghost",
    },
    {
      title: "Categories",
      icon: FolderOpen,
      href: "/dashboard/categories",
      variant: "ghost",
    },
    {
      title: "Media",
      icon: ImageIcon,
      href: "/dashboard/media",
      variant: "ghost",
    },
    {
      title: "AI Content Studio",
      icon: BrainCircuit,
      href: "/dashboard/ai-content",
      variant: "ghost",
    },
    {
      title: "Collaborative Docs",
      icon: FileEdit,
      href: "/dashboard/documents",
      variant: "ghost",
    },
    {
      title: "Sponsored Content",
      icon: Megaphone,
      href: "/dashboard/sponsored",
      variant: "ghost",
      adminOnly: true,
    },
    {
      title: "Subscriptions",
      icon: DollarSign,
      href: "/dashboard/subscriptions",
      variant: "ghost",
      adminOnly: true,
    },
    {
      title: "Integrations",
      icon: Plug,
      href: "/dashboard/integrations",
      variant: "ghost",
    },
    {
      title: "Settings",
      icon: Settings,
      href: "/dashboard/settings",
      variant: "ghost",
    },
    {
      title: "Users",
      icon: Users,
      href: "/dashboard/users",
      variant: "ghost",
      adminOnly: true,
    },
  ]

  return (
    <div className={cn("pb-12 h-full", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Dashboard</h2>
          <ScrollArea className="h-[calc(100vh-10rem)]">
            <div className="space-y-1">
              {routes.map((route) => {
                if (route.adminOnly && !isAdmin) return null

                return (
                  <Link key={route.href} href={route.href} passHref>
                    <Button
                      variant={pathname === route.href ? "secondary" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                    >
                      <route.icon className="mr-2 h-4 w-4" />
                      {route.title}
                    </Button>
                  </Link>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
