import { Skeleton } from "@/components/ui/skeleton"

export default function PropertiesLoading() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Skeleton className="h-7 w-52" />
      <Skeleton className="mt-5 h-12 w-full max-w-2xl" />
      <Skeleton className="mt-3 h-5 w-full max-w-xl" />

      <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="hidden h-[620px] rounded-2xl lg:block" />
        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-2xl border bg-card"
            >
              <div className="grid min-h-64 sm:grid-cols-[44%_1fr]">
                <Skeleton className="min-h-56 rounded-none sm:min-h-full" />
                <div className="space-y-4 p-5">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
