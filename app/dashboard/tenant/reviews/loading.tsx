import { Skeleton } from "@/components/ui/skeleton"

export default function TenantReviewsLoading() {
  return (
    <div className="space-y-7" aria-label="Loading tenant reviews">
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-5 w-[38rem] max-w-full" />
      </div>
      <div className="grid gap-5 xl:grid-cols-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-72 rounded-xl" />
        ))}
      </div>
    </div>
  )
}
