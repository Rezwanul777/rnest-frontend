import { Skeleton } from "@/components/ui/skeleton"

export default function EditLandlordPropertyLoading() {
  return (
    <div
      className="mx-auto max-w-4xl space-y-7"
      aria-label="Loading property editor"
    >
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-64 max-w-full" />
        <Skeleton className="h-5 w-[34rem] max-w-full" />
      </div>
      <Skeleton className="h-[44rem] rounded-xl" />
      <Skeleton className="h-72 rounded-xl" />
    </div>
  )
}
