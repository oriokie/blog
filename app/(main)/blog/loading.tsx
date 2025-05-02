import { Skeleton } from "@/components/ui/skeleton"

export default function BlogLoading() {
  return (
    <div className="py-16 md:py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-10 w-24 rounded-full" />
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array(9)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm"
              >
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex items-center mt-4">
                    <Skeleton className="h-8 w-8 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-1" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
