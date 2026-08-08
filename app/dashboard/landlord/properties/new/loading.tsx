import { Skeleton } from "@/components/ui/skeleton"

export default function NewLandlordPropertyLoading() {
  return (
    <div
      className="mx-auto max-w-4xl space-y-7"
      aria-label="Loading property form"
    >
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-[34rem] max-w-full" />
      </div>
      <Skeleton className="h-[44rem] rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  )
}
