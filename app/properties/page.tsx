import type { Metadata } from "next"

import { PropertyCatalog } from "@/components/properties/property-catalog"
import type { PropertyFiltersState } from "@/components/properties/property-filters"
import { getCategories } from "@/services/category.service"
import {
  getProperties,
  getPropertyAmenities,
} from "@/services/property.service"
import type { PropertyQuery } from "@/types/property"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Browse rental properties",
  description:
    "Browse and filter verified rental properties by location, type, monthly rent, and amenities.",
}

type PropertiesPageProps = {
  searchParams: Promise<{
    location?: string | string[]
    search?: string | string[]
    categoryId?: string | string[]
    minRent?: string | string[]
    maxRent?: string | string[]
    amenities?: string | string[]
    page?: string | string[]
    sortBy?: string | string[]
    sortOrder?: string | string[]
  }>
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "")
}

function positiveInteger(value: string, fallback: string) {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? String(parsed) : fallback
}

function parseAmenities(value: string | string[] | undefined) {
  const values = Array.isArray(value) ? value : value ? [value] : []

  return [
    ...new Set(
      values
        .flatMap((item) => item.split(","))
        .map((item) => item.trim())
        .filter(Boolean)
    ),
  ]
}

export default async function PropertiesPage({
  searchParams,
}: PropertiesPageProps) {
  const query = await searchParams
  const initialFilters: PropertyFiltersState = {
    search: first(query.search) || first(query.location),
    categoryId: first(query.categoryId),
    minRent: first(query.minRent),
    maxRent: first(query.maxRent),
    amenities: parseAmenities(query.amenities),
  }

  const sortBy = first(query.sortBy)
  const sortOrder = first(query.sortOrder)
  const initialSort =
    sortBy === "rent" && sortOrder === "asc"
      ? "rent-asc"
      : sortBy === "rent" && sortOrder === "desc"
        ? "rent-desc"
        : "newest"
  const page = positiveInteger(first(query.page), "1")

  const propertyQuery: PropertyQuery = {
    page,
    limit: "6",
    search: initialFilters.search,
    categoryId: initialFilters.categoryId,
    minRent: initialFilters.minRent,
    maxRent: initialFilters.maxRent,
    amenities: initialFilters.amenities,
    sortBy: initialSort === "newest" ? "createdAt" : "rent",
    sortOrder: initialSort === "rent-asc" ? "asc" : "desc",
  }

  const [propertyData, categories, amenities] = await Promise.all([
    getProperties(propertyQuery),
    getCategories(),
    getPropertyAmenities(),
  ])

  return (
    <main>
      <PropertyCatalog
        key={JSON.stringify(propertyQuery)}
        listings={propertyData.listings}
        meta={propertyData.meta}
        categories={categories}
        amenities={amenities}
        initialFilters={initialFilters}
        initialSort={initialSort}
      />
    </main>
  )
}
