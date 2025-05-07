import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface TopicTagsProps {
  topics: string[]
  className?: string
}

export function TopicTags({ topics, className = "" }: TopicTagsProps) {
  if (!topics || topics.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {topics.map((topic) => (
        <Link key={topic} href={`/topics/${encodeURIComponent(topic)}`}>
          <Badge variant="secondary" className="hover:bg-secondary/80 cursor-pointer">
            {topic}
          </Badge>
        </Link>
      ))}
    </div>
  )
}
