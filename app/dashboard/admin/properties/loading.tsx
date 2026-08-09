import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPropertiesLoading() {
  return (
    <div className="space-y-7" aria-label="Loading property moderation">
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-[42rem] max-w-full" />
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[29rem] rounded-xl" />
        ))}
      </div>
    </div>
  )
}
