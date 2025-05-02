"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { user } = useAuth()

  const isLoggedIn = !!user

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Define colorful nav items
  const navItems = [
    { name: "Home", path: "/", color: "text-apple-red hover:text-apple-red" },
    { name: "Blog", path: "/blog", color: "text-apple-blue hover:text-apple-blue" },
    { name: "About", path: "/about", color: "text-apple-purple hover:text-apple-purple" },
  ]

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        isScrolled || isOpen
          ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
          : "bg-transparent"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-2xl font-semibold text-gray-900 dark:text-white flex items-center">
            <div className="h-8 w-8 relative overflow-hidden">
              <div className="absolute inset-0 animated-gradient rounded-full"></div>
              <svg
                className="h-8 w-8 relative z-10 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09998 22C7.78998 22.05 6.79998 20.68 5.95998 19.47C4.24998 17 2.93998 12.45 4.69998 9.39C5.56998 7.87 7.12998 6.91 8.81998 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.09 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
                  className="fill-current"
                />
              </svg>
            </div>
            <span className="ml-2 hidden sm:inline colorful-gradient">Apple Blog</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.path}
                className={`text-sm font-medium transition-all ${
                  pathname === item.path || (item.path === "/blog" && pathname.startsWith("/blog/"))
                    ? `${item.color} font-bold`
                    : `text-gray-600 dark:text-gray-300 ${item.color}`
                }`}
              >
                {item.name}
              </Link>
            ))}
            <ThemeToggle />
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-medium ${pathname.includes("/dashboard") ? "text-apple-green font-bold" : "text-gray-600 dark:text-gray-300 hover:text-apple-green"}`}
                >
                  Dashboard
                </Link>
                <Button
                  variant="default"
                  className="bg-apple-purple hover:bg-apple-purple/90 text-white rounded-full"
                  onClick={() => {
                    // Handle logout
                  }}
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-gradient-rainbow hover:opacity-90 text-white rounded-full">Sign In</Button>
              </Link>
            )}
          </nav>

          <div className="flex items-center md:hidden space-x-4">
            <ThemeToggle />
            <button
              className="text-gray-900 dark:text-white"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden bg-white dark:bg-gray-900"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              {navItems.map((item, index) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`block px-3 py-2 text-base font-medium rounded-md ${
                    pathname === item.path || (item.path === "/blog" && pathname.startsWith("/blog/"))
                      ? `bg-gradient-to-r ${index === 0 ? "from-apple-red to-apple-orange" : index === 1 ? "from-apple-blue to-apple-teal" : "from-apple-purple to-apple-pink"} text-white`
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`block px-3 py-2 text-base font-medium rounded-md ${
                      pathname.includes("/dashboard")
                        ? "bg-gradient-to-r from-apple-green to-apple-mint text-white"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-apple-purple to-apple-pink rounded-md"
                    onClick={() => {
                      // Handle logout
                      setIsOpen(false)
                    }}
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-white bg-gradient-rainbow rounded-md"
                  onClick={() => setIsOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
