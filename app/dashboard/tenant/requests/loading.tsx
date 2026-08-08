import { Skeleton } from "@/components/ui/skeleton"

export default function TenantRequestsLoading() {
  return (
    <div className="space-y-7" aria-label="Loading rental requests">
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-[30rem] max-w-full" />
      </div>
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24" />
        ))}
      </div>
      <Skeleton className="h-[28rem] w-full rounded-xl" />
    </div>
  )
}
