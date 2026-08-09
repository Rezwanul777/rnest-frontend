import { Skeleton } from "@/components/ui/skeleton"

export default function TenantPaymentLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6" aria-label="Loading payment">
      <Skeleton className="h-9 w-48" />
      <div className="space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-10 w-96 max-w-full" />
        <Skeleton className="h-5 w-[36rem] max-w-full" />
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
        <Skeleton className="h-[32rem] rounded-xl" />
        <Skeleton className="h-80 rounded-xl" />
      </div>
    </div>
  )
}
