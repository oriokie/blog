"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Settings,
  Users,
  Bell,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { useMediaQuery } from "@/hooks/use-media-query"

interface SidebarProps {
  isMobile: boolean
  isOpen: boolean
  onClose: () => void
}

export default function DashboardSidebar({ isMobile, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("posts")
  const { user, logout } = useAuth()
  const router = useRouter()
  const isSmallScreen = useMediaQuery("(max-width: 768px)")

  // Close sidebar on small screens when navigating
  useEffect(() => {
    if (isSmallScreen && isOpen) {
      onClose()
    }
  }, [pathname, isSmallScreen, isOpen, onClose])

  const toggleSubmenu = (menu: string) => {
    setOpenSubmenu(openSubmenu === menu ? null : menu)
  }

  const handleLogout = async () => {
    await logout()
    router.push("/login")
  }

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  }

  const menuItems = [
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/dashboard",
    },
    {
      title: "Posts",
      icon: <FileText className="h-5 w-5" />,
      submenu: [
        { title: "All Posts", href: "/dashboard/posts" },
        { title: "Add New", href: "/dashboard/posts/new" },
        { title: "Categories", href: "/dashboard/posts/categories" },
      ],
    },
    {
      title: "Reading List",
      icon: <BookOpen className="h-5 w-5" />,
      href: "/dashboard/reading-list",
    },
    {
      title: "Users",
      icon: <Users className="h-5 w-5" />,
      href: "/dashboard/users",
    },
    {
      title: "Notifications",
      icon: <Bell className="h-5 w-5" />,
      href: "/dashboard/notifications",
    },
    {
      title: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/dashboard/settings",
    },
  ]

  const sidebar = (
    <div className="flex h-full flex-col bg-white dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 w-64">
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-800">
        <Link href="/" className="flex items-center">
          <svg
            className="h-8 w-8 text-gray-900 dark:text-white"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09998 22C7.78998 22.05 6.79998 20.68 5.95998 19.47C4.24998 17 2.93998 12.45 4.69998 9.39C5.56998 7.87 7.12998 6.91 8.81998 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
              className="fill-current"
            />
          </svg>
          <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white">Blog</span>
        </Link>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {menuItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={`flex items-center w-full px-3 py-2 text-sm font-medium rounded-md ${
                      pathname.includes(`/dashboard/${item.title.toLowerCase()}`)
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3 flex-1">{item.title}</span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openSubmenu === item.title ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openSubmenu === item.title && (
                    <div className="mt-1 space-y-1 pl-10">
                      {item.submenu.map((subitem) => (
                        <Link
                          key={subitem.title}
                          href={subitem.href}
                          className={`block px-3 py-2 text-sm font-medium rounded-md ${
                            pathname === subitem.href
                              ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                          }`}
                          onClick={isMobile ? onClose : undefined}
                        >
                          {subitem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    pathname === item.href
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                  }`}
                  onClick={isMobile ? onClose : undefined}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </div>
      <div className="border-t border-gray-200 dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                {user?.avatar && (
                  <img
                    src={user.avatar || "/placeholder.svg"}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-[120px]">
                {user ? `${user.firstName} ${user.lastName}` : "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">{user?.email}</p>
            </div>
          </div>
          <ThemeToggle />
        </div>
        <div className="mt-4">
          <Button variant="outline" className="w-full flex items-center justify-center" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )

  return isMobile ? (
    <motion.div
      className="fixed inset-0 z-40 md:hidden"
      animate={isOpen ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3 }}
    >
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={onClose} />
      <div className="relative flex h-full flex-col bg-white dark:bg-gray-950 w-64">{sidebar}</div>
    </motion.div>
  ) : (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64">{sidebar}</div>
    </div>
  )
}
