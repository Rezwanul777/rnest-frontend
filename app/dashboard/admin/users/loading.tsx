import { Skeleton } from "@/components/ui/skeleton"

export default function AdminUsersLoading() {
  return (
    <div className="space-y-7" aria-label="Loading users">
      <div className="space-y-3">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-10 w-72 max-w-full" />
        <Skeleton className="h-5 w-[40rem] max-w-full" />
      </div>
      <Skeleton className="h-20 rounded-xl" />
      <Skeleton className="h-[34rem] rounded-xl" />
    </div>
  )
}
