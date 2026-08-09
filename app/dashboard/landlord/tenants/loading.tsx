import { Skeleton } from "@/components/ui/skeleton"

export default function LandlordTenantHistoryLoading() {
  return (
    <div className="space-y-7" aria-label="Loading tenant history">
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-5 w-[38rem] max-w-full" />
      </div>
      <Skeleton className="h-10 w-full max-w-2xl rounded-lg" />
      <Skeleton className="h-[32rem] rounded-xl" />
    </div>
  )
}
