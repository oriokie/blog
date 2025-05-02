"use client"

import Link from "next/link"
import { Github, Twitter, Linkedin, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-0 left-0 w-full h-full animated-gradient"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-apple-purple to-apple-pink bg-clip-text text-transparent">
              About
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              A sleek, modern blog with Apple-inspired design. Sharing thoughts on technology, design, and innovation.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-apple-blue dark:text-apple-teal hover:text-apple-indigo dark:hover:text-apple-mint transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-apple-blue dark:text-apple-teal hover:text-apple-indigo dark:hover:text-apple-mint transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-apple-blue dark:text-apple-teal hover:text-apple-indigo dark:hover:text-apple-mint transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-apple-blue dark:text-apple-teal hover:text-apple-indigo dark:hover:text-apple-mint transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-apple-blue to-apple-teal bg-clip-text text-transparent">
              Categories
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-apple-blue dark:hover:text-apple-teal transition-colors"
                >
                  Technology
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-apple-purple dark:hover:text-apple-pink transition-colors"
                >
                  Design
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-apple-green dark:hover:text-apple-mint transition-colors"
                >
                  Development
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="text-gray-600 dark:text-gray-400 hover:text-apple-orange dark:hover:text-apple-yellow transition-colors"
                >
                  Productivity
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-apple-green to-apple-mint bg-clip-text text-transparent">
              Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 dark:text-gray-400 hover:text-apple-red dark:hover:text-apple-orange transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 dark:text-gray-400 hover:text-apple-blue dark:hover:text-apple-teal transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 dark:text-gray-400 hover:text-apple-purple dark:hover:text-apple-pink transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/login"
                  className="text-gray-600 dark:text-gray-400 hover:text-apple-green dark:hover:text-apple-mint transition-colors"
                >
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-apple-red to-apple-orange bg-clip-text text-transparent">
              Subscribe
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Stay updated with our latest articles and news.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-apple-blue dark:focus:ring-apple-teal"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-apple-blue to-apple-teal text-white rounded-r-md hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {new Date().getFullYear()} <span className="colorful-gradient font-bold">Apple Blog</span>. All rights
            reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-apple-purple dark:hover:text-apple-pink transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-gray-600 dark:text-gray-400 hover:text-apple-blue dark:hover:text-apple-teal transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
