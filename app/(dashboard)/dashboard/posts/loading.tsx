import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 w-[180px]" />
      </div>
      <div className="rounded-md border">
        <div className="h-10 border-b px-4 py-2">
          <div className="flex">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-4 flex-1 mx-2" />
              ))}
          </div>
        </div>
        <div className="space-y-2 p-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
        </div>
      </div>
    </div>
  )
}
