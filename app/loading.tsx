import { Skeleton } from "@/components/ui/skeleton"

export default function HomeLoading() {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <Skeleton className="h-6 w-64" />
      <Skeleton className="mt-6 h-16 max-w-2xl" />
      <Skeleton className="mt-4 h-6 max-w-xl" />
      <Skeleton className="mt-10 h-20 rounded-2xl" />
      <div className="mt-20 grid gap-5 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Skeleton key={index} className="h-72 rounded-2xl" />
        ))}
      </div>
    </main>
  )
}
