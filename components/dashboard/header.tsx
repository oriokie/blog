"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UserMenu } from "@/components/dashboard/user-menu"

interface HeaderProps {
  onOpenSidebar: () => void
}

export default function DashboardHeader({ onOpenSidebar }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  // Get the current page title based on the pathname
  const getPageTitle = () => {
    if (pathname === "/dashboard") return "Dashboard"
    if (pathname === "/dashboard/posts") return "All Posts"
    if (pathname === "/dashboard/posts/new") return "Add New Post"
    if (pathname === "/dashboard/posts/categories") return "Categories"
    if (pathname === "/dashboard/reading-list") return "Reading List"
    if (pathname === "/dashboard/users") return "Users"
    if (pathname === "/dashboard/notifications") return "Notifications"
    if (pathname === "/dashboard/settings") return "Settings"
    return "Dashboard"
  }

  return (
    <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="md:hidden mr-2" onClick={onOpenSidebar}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Open sidebar</span>
          </Button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">{getPageTitle()}</h1>
        </div>
        <div className="flex items-center space-x-4">
          {isSearchOpen ? (
            <div className="relative">
              <Input
                type="search"
                placeholder="Search..."
                className="w-full sm:w-64 pl-10"
                autoFocus
                onBlur={() => setIsSearchOpen(false)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
          <Link href="/" className="hidden sm:block">
            <Button variant="outline" size="sm">
              View Blog
            </Button>
          </Link>
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
