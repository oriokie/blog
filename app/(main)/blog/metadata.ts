import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Blog | Apple Blog",
  description: "Explore our collection of articles on technology, design, and innovation.",
  openGraph: {
    title: "Blog | Apple Blog",
    description: "Explore our collection of articles on technology, design, and innovation.",
    url: "https://apple-blog.vercel.app/blog",
    siteName: "Apple Blog",
    images: [
      {
        url: "/og-image-blog.jpg",
        width: 1200,
        height: 630,
        alt: "Apple Blog - Articles",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Apple Blog",
    description: "Explore our collection of articles on technology, design, and innovation.",
    images: ["/og-image-blog.jpg"],
  },
}
