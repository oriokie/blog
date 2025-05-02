"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-950 px-4 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
        <h1 className="text-9xl font-bold text-gray-900 dark:text-white">404</h1>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-6">Page Not Found</h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link href="/">
            <Button className="bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white rounded-full px-8 py-6 text-lg">
              Go Home
            </Button>
          </Link>
          <Link href="/blog">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-full px-8 py-6 text-lg"
            >
              Browse Blog
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
