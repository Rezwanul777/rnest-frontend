import { Skeleton } from "@/components/ui/skeleton"

export default function PropertyDetailsLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-6 w-40" />
      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Skeleton className="min-h-[520px] rounded-3xl" />
        <div className="space-y-4">
          <Skeleton className="h-[252px] rounded-3xl" />
          <Skeleton className="h-[252px] rounded-3xl" />
        </div>
      </div>
      <Skeleton className="mt-10 h-12 max-w-2xl" />
      <Skeleton className="mt-5 h-28 max-w-3xl" />
    </main>
  )
}
