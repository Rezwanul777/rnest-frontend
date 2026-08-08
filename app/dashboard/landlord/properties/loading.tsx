import { Skeleton } from "@/components/ui/skeleton"

export default function LandlordPropertiesLoading() {
  return (
    <div className="space-y-7" aria-label="Loading landlord properties">
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-[30rem] max-w-full" />
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton key={index} className="h-[28rem] rounded-xl" />
        ))}
      </div>
    </div>
  )
}
