"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, loading, error, clearError } = useAuth()

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      clearError()
    }
  }, [clearError])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-white dark:bg-gray-950">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="flex justify-between items-center mb-8">
            <Link href="/" className="text-2xl font-semibold flex items-center">
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
            <ThemeToggle />
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              <span className="bg-gradient-to-r from-apple-purple to-apple-pink bg-clip-text text-transparent">
                Sign in to your account
              </span>
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Or{" "}
              <Link href="/signup" className="font-medium text-apple-blue dark:text-apple-teal hover:underline">
                create a new account
              </Link>
            </p>
          </motion.div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {error && (
              <Alert variant="destructive" className="mb-4 bg-apple-red/10 text-apple-red border border-apple-red/20">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email address
                  </Label>
                  <div className="mt-1">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-apple-blue focus:ring-apple-blue dark:focus:border-apple-teal dark:focus:ring-apple-teal"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </Label>
                  <div className="mt-1 relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-apple-blue focus:ring-apple-blue dark:focus:border-apple-teal dark:focus:ring-apple-teal pr-10"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" aria-hidden="true" />
                      ) : (
                        <Eye className="h-5 w-5" aria-hidden="true" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Checkbox
                      id="remember-me"
                      className="h-4 w-4 text-apple-blue dark:text-apple-teal focus:ring-apple-blue dark:focus:ring-apple-teal"
                    />
                    <Label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Remember me
                    </Label>
                  </div>

                  <div className="text-sm">
                    <Link href="#" className="font-medium text-apple-blue dark:text-apple-teal hover:underline">
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-apple-blue to-apple-teal hover:opacity-90 text-white rounded-md py-2 px-4 shadow-lg shadow-apple-blue/20"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-white dark:border-gray-900 border-t-transparent dark:border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      "Sign in"
                    )}
                  </Button>
                </div>
              </form>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-white dark:bg-gray-950 px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <svg
                    className="h-5 w-5 mr-2 text-apple-red dark:text-apple-orange"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.549 3.921 1.453l2.814-2.814C17.503 2.988 15.139 2 12.545 2 7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  className="w-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <svg
                    className="h-5 w-5 mr-2 text-apple-blue dark:text-apple-teal"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M22.675 0H1.325C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116c.73 0 1.323-.593 1.323-1.325V1.325C24 .593 23.407 0 22.675 0z" />
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block relative w-0 flex-1 animated-gradient">
        <div className="absolute inset-0 bg-opacity-70 flex flex-col justify-center items-center p-12 text-white">
          <motion.div
            className="max-w-xl text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Welcome to <span className="bg-clip-text text-transparent bg-gradient-rainbow">Apple Blog</span>
            </h2>
            <p className="text-lg text-gray-200 mb-6">
              Sign in to access exclusive content, save your favorite articles, and join our community of tech
              enthusiasts.
            </p>
            <div className="flex justify-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white">100+</div>
                <div className="text-sm text-gray-300">Articles</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white">50k+</div>
                <div className="text-sm text-gray-300">Readers</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-3xl font-bold text-white">24/7</div>
                <div className="text-sm text-gray-300">Support</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
