import { Skeleton } from "@/components/ui/skeleton"

export default function AuthLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border bg-card p-8">
      <Skeleton className="h-5 w-28" />
      <Skeleton className="mt-4 h-10 w-72" />
      <Skeleton className="mt-3 h-5 w-full max-w-md" />
      <div className="mt-8 space-y-5">
        <Skeleton className="h-20 rounded-2xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
        <Skeleton className="h-11 rounded-xl" />
      </div>
    </div>
  )
}
