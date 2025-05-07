import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <Skeleton className="h-10 w-[300px]" />
      <div className="grid gap-4 md:grid-cols-2">
        {Array(2)
          .fill(0)
          .map((_, i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
      </div>
      <Skeleton className="h-[400px] w-full" />
    </div>
  )
}
