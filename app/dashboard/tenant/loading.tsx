import { Skeleton } from "@/components/ui/skeleton"

export default function TenantDashboardLoading() {
  return (
    <div className="space-y-8" aria-label="Loading tenant dashboard">
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-5 w-52" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-[38rem] max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-52 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-5 xl:grid-cols-[2fr_1fr]">
        <Skeleton className="h-96 rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  )
}
