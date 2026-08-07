"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  LoaderCircle,
  SlidersHorizontal,
} from "lucide-react"

import { PropertyCard } from "@/components/home/property-card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

import type { Category, Property } from "@/types/property"
import { PaginationMeta } from "@/types/api"
import { PropertyFilters, PropertyFiltersState } from "./property-filters"


export type SortOption = "newest" | "rent-asc" | "rent-desc"

type PropertyCatalogProps = {
  listings: Property[]
  meta: PaginationMeta
  categories: Category[]
  amenities: string[]
  initialFilters: PropertyFiltersState
  initialSort: SortOption
}

const emptyFilters: PropertyFiltersState = {
  search: "",
  categoryId: "",
  minRent: "",
  maxRent: "",
  amenities: [],
}

function createSearchParams(
  filters: PropertyFiltersState,
  sort: SortOption,
  page: number
) {
  const params = new URLSearchParams()

  if (filters.search.trim()) params.set("search", filters.search.trim())
  if (filters.categoryId) params.set("categoryId", filters.categoryId)
  if (filters.minRent) params.set("minRent", filters.minRent)
  if (filters.maxRent) params.set("maxRent", filters.maxRent)
  if (filters.amenities.length > 0) {
    params.set("amenities", filters.amenities.join(","))
  }
  if (page > 1) params.set("page", String(page))

  if (sort === "rent-asc") {
    params.set("sortBy", "rent")
    params.set("sortOrder", "asc")
  } else if (sort === "rent-desc") {
    params.set("sortBy", "rent")
    params.set("sortOrder", "desc")
  }

  return params
}

export function PropertyCatalog({
  listings,
  meta,
  categories,
  amenities,
  initialFilters,
  initialSort,
}: PropertyCatalogProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = React.useTransition()
  const [filters, setFilters] = React.useState(initialFilters)
  const [sort, setSort] = React.useState<SortOption>(initialSort)
  const [requestedPage, setRequestedPage] = React.useState(meta.page)
  const firstRender = React.useRef(true)

  React.useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    const timeout = window.setTimeout(() => {
      const params = createSearchParams(filters, sort, requestedPage)
      if (params.toString() === searchParams.toString()) return

      const nextUrl = params.size > 0 ? `${pathname}?${params}` : pathname

      startTransition(() => {
        router.replace(nextUrl, { scroll: false })
      })
    }, 350)

    return () => window.clearTimeout(timeout)
  }, [filters, pathname, requestedPage, router, searchParams, sort])

  function changeFilters(nextFilters: PropertyFiltersState) {
    setFilters(nextFilters)
    setRequestedPage(1)
  }

  function resetFilters() {
    setFilters(emptyFilters)
    setRequestedPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Badge variant="outline" className="mb-4 bg-background/80">
          Live rental listings
        </Badge>
        <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
          Find a place that fits your life.
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          Search current listings, compare monthly rent, and find an available
          home directly from RentNest.
        </p>
      </div>

      <details className="group mb-5 rounded-2xl border bg-card p-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between font-medium [&::-webkit-details-marker]:hidden">
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="size-4" /> Filters
          </span>
          <Badge variant="secondary">{meta.total} results</Badge>
        </summary>
        <div className="mt-5 border-t pt-5">
          <PropertyFilters
            filters={filters}
            categories={categories}
            amenities={amenities}
            onChange={changeFilters}
            onReset={resetFilters}
          />
        </div>
      </details>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block" aria-label="Property filters">
          <Card className="sticky top-24 rounded-2xl p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-semibold">
                <SlidersHorizontal className="size-4" /> Filters
              </h2>
              <Badge variant="secondary">{meta.total}</Badge>
            </div>
            <PropertyFilters
              filters={filters}
              categories={categories}
              amenities={amenities}
              onChange={changeFilters}
              onReset={resetFilters}
            />
          </Card>
        </aside>

        <section aria-live="polite" aria-label="Property results">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              {isPending && <LoaderCircle className="size-4 animate-spin" />}
              Showing{" "}
              <span className="font-medium text-foreground">
                {listings.length}
              </span>
              of{" "}
              <span className="font-medium text-foreground">{meta.total}</span>
              properties
            </p>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Sort by
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value as SortOption)
                  setRequestedPage(1)
                }}
                className="h-9 rounded-lg border bg-background px-3 text-sm font-medium text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="newest">Newest</option>
                <option value="rent-asc">Rent: low to high</option>
                <option value="rent-desc">Rent: high to low</option>
              </select>
            </label>
          </div>

          <div
            className={
              isPending ? "opacity-55 transition-opacity" : "transition-opacity"
            }
          >
            {listings.length > 0 ? (
              <div className="grid gap-5 xl:grid-cols-2">
                {listings.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <Card className="items-center rounded-2xl px-6 py-16 text-center">
                <span className="flex size-14 items-center justify-center rounded-2xl bg-muted">
                  <SlidersHorizontal className="size-6 text-muted-foreground" />
                </span>
                <h2 className="mt-5 text-xl font-semibold">
                  No properties match these filters
                </h2>
                <p className="mt-2 max-w-md text-sm text-muted-foreground">
                  Try another location, increase your budget, or remove one of
                  the selected amenities.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-5"
                  onClick={resetFilters}
                >
                  Clear all filters
                </Button>
              </Card>
            )}
          </div>

          {meta.totalPages > 1 && (
            <nav
              className="mt-8 flex items-center justify-between border-t pt-5"
              aria-label="Property pagination"
            >
              <Button
                type="button"
                variant="outline"
                disabled={meta.page <= 1 || isPending}
                onClick={() => setRequestedPage(Math.max(1, meta.page - 1))}
              >
                <ArrowLeft /> Previous
              </Button>
              <p className="text-sm text-muted-foreground">
                Page {meta.page} of {meta.totalPages}
              </p>
              <Button
                type="button"
                variant="outline"
                disabled={meta.page >= meta.totalPages || isPending}
                onClick={() =>
                  setRequestedPage(Math.min(meta.totalPages, meta.page + 1))
                }
              >
                Next <ArrowRight />
              </Button>
            </nav>
          )}
        </section>
      </div>
    </div>
  )
}
