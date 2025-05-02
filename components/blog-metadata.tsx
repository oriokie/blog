import type { Metadata } from "next"

interface BlogPostMetadataProps {
  title: string
  description: string
  image?: string
  author?: string
  publishedTime?: string
  category?: string
  tags?: string[]
  canonical?: string
}

export function generateBlogPostMetadata({
  title,
  description,
  image = "/og-image.jpg",
  author = "Apple Blog Team",
  publishedTime,
  category,
  tags = [],
  canonical,
}: BlogPostMetadataProps): Metadata {
  const metadata: Metadata = {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime,
      authors: [author],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }

  if (canonical) {
    metadata.alternates = {
      canonical,
    }
  }

  return metadata
}
