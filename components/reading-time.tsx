import { Clock } from "lucide-react"

interface ReadingTimeProps {
  minutes: number
  className?: string
}

export function ReadingTime({ minutes, className = "" }: ReadingTimeProps) {
  // Format the reading time
  const formattedTime = minutes < 1 ? "< 1 min read" : `${Math.round(minutes)} min read`

  return (
    <div className={`flex items-center text-sm text-muted-foreground ${className}`}>
      <Clock className="h-3 w-3 mr-1" />
      <span>{formattedTime}</span>
    </div>
  )
}
