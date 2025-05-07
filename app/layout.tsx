import type React from "react"
import "@/app/globals.css"
import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

// Separate viewport export as per Next.js docs
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "OriokieX",
    template: "%s | OriokieX",
  },
  description: "A sleek, modern blog with innovative features. Sharing thoughts on technology, design, and innovation.",
  keywords: ["oriokiex", "technology", "design", "innovation", "blog"],
  authors: [{ name: "OriokieX Team" }],
  creator: "OriokieX Team",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://oriokiex.vercel.app",
    title: "OriokieX",
    description:
      "A sleek, modern blog with innovative features. Sharing thoughts on technology, design, and innovation.",
    siteName: "OriokieX",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "OriokieX",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OriokieX",
    description:
      "A sleek, modern blog with innovative features. Sharing thoughts on technology, design, and innovation.",
    images: ["/og-image.jpg"],
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
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
