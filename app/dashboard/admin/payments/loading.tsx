import { Skeleton } from "@/components/ui/skeleton"

export default function AdminPaymentsLoading() {
  return (
    <div className="space-y-7" aria-label="Loading payments">
      <div className="space-y-3">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-10 w-80 max-w-full" />
        <Skeleton className="h-5 w-[42rem] max-w-full" />
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-[34rem] rounded-xl" />
    </div>
  )
}
