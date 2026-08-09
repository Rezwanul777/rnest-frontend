import { Skeleton } from "@/components/ui/skeleton"

export default function TenantPaymentsLoading() {
  return (
    <div className="space-y-7" aria-label="Loading payment history">
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-[38rem] max-w-full" />
      </div>
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-10 w-24 shrink-0" />
        ))}
      </div>
      <Skeleton className="h-[32rem] rounded-xl" />
    </div>
  )
}
