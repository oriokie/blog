import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Apple Blog",
    template: "%s | Apple Blog",
  },
  description:
    "A sleek, modern blog with Apple-inspired design. Sharing thoughts on technology, design, and innovation.",
  keywords: ["apple", "technology", "design", "innovation", "blog"],
  authors: [{ name: "Apple Blog Team" }],
  creator: "Apple Blog Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://apple-blog.vercel.app",
    title: "Apple Blog",
    description:
      "A sleek, modern blog with Apple-inspired design. Sharing thoughts on technology, design, and innovation.",
    siteName: "Apple Blog",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Apple Blog",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Apple Blog",
    description:
      "A sleek, modern blog with Apple-inspired design. Sharing thoughts on technology, design, and innovation.",
    images: ["/og-image.jpg"],
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
