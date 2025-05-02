import { Skeleton } from "@/components/ui/skeleton"

export default function BlogPostLoading() {
  return (
    <article className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[70vh] bg-gray-900">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 md:px-6 pb-12 md:pb-24">
            <Skeleton className="h-4 w-24 mb-6" />
            <Skeleton className="h-12 md:h-16 w-full max-w-2xl mb-4" />
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0">
              <div className="flex items-center mr-0 sm:mr-6">
                <Skeleton className="h-10 w-10 rounded-full mr-3" />
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          <div className="my-8">
            <Skeleton className="h-64 w-full rounded-xl" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-5/6" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-28 rounded-full" />
            </div>
          </div>

          {/* Author Bio */}
          <div className="mt-12 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-0">
              <Skeleton className="h-16 w-16 rounded-full mr-0 sm:mr-4" />
              <div className="text-center sm:text-left">
                <Skeleton className="h-5 w-48 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mt-12">
            <Skeleton className="h-8 w-40 mb-6" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        </div>
      </div>
    </article>
  )
}
