import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import type { PaginationMeta } from "@/types/api"
import type { Category, Property } from "@/types/property"

type ApiAdminProperty = Omit<
  Property,
  "rent" | "size" | "image" | "category"
> & {
  rent: number | string
  size: number | string | null
  images?: string[]
  category?: Category
  categoryId?: string
}

type ApiAdminPropertyList = {
  listings: ApiAdminProperty[]
  meta: PaginationMeta
}

export type AdminPropertyQuery = {
  page?: number
  limit?: number
  search?: string
  isAvailable?: "true" | "false"
}

const PROPERTY_PLACEHOLDER = "/property-placeholder.svg"

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeProperty(property: ApiAdminProperty): Property {
  const images = Array.isArray(property.images)
    ? property.images.filter(Boolean)
    : []

  return {
    ...property,
    rent: toNumber(property.rent) ?? 0,
    size: toNumber(property.size),
    bedrooms: toNumber(property.bedrooms),
    bathrooms: toNumber(property.bathrooms),
    images,
    image: images[0] ?? PROPERTY_PLACEHOLDER,
    category: property.category ?? {
      id: property.categoryId ?? "uncategorized",
      name: "Rental property",
    },
  }
}

export async function getAdminProperties({
  page = 1,
  limit = 8,
  search,
  isAvailable,
}: AdminPropertyQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  if (search) params.set("search", search)
  if (isAvailable) params.set("isAvailable", isAvailable)

  const response = await authenticatedApiFetch<ApiAdminPropertyList>(
    `/admin/properties?${params}`
  )

  return {
    listings: response.data.listings.map(normalizeProperty),
    meta: response.data.meta,
  }
}
