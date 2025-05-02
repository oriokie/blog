"use client"

import Head from "next/head"
import { useRouter } from "next/navigation"

interface SEOProps {
  title?: string
  description?: string
  keywords?: string
  ogImage?: string
  ogType?: string
  canonicalUrl?: string
}

export default function SEO({
  title = "Apple Blog",
  description = "A sleek, modern blog with Apple-inspired design. Sharing thoughts on technology, design, and innovation.",
  keywords = "apple, technology, design, innovation, blog",
  ogImage = "/og-image.jpg",
  ogType = "website",
  canonicalUrl,
}: SEOProps) {
  const router = useRouter()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://apple-blog.vercel.app"
  const currentUrl = canonicalUrl || `${siteUrl}${router.pathname}`
  const fullTitle = `${title} | Apple Blog`

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
    </Head>
  )
}
