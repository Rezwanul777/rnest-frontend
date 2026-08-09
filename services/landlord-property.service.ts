import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import { ApiError } from "@/services/api-client"
import type { PaginationMeta } from "@/types/api"
import type { Category, Property } from "@/types/property"

type ApiLandlordProperty = Omit<
  Property,
  "rent" | "size" | "image" | "category"
> & {
  rent: number | string
  size: number | string | null
  images?: string[]
  category?: Category
  categoryId?: string
}

type ApiLandlordPropertyList = {
  listings: ApiLandlordProperty[]
  meta: PaginationMeta
}

export type LandlordPropertyQuery = {
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

function normalizeProperty(property: ApiLandlordProperty): Property {
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

export async function getLandlordProperties({
  page = 1,
  limit = 6,
  search,
  isAvailable,
}: LandlordPropertyQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  if (search) params.set("search", search)
  if (isAvailable) params.set("isAvailable", isAvailable)

  const response = await authenticatedApiFetch<ApiLandlordPropertyList>(
    `/properties/me?${params}`
  )

  return {
    listings: response.data.listings.map(normalizeProperty),
    meta: response.data.meta,
  }
}

export async function getLandlordPropertyById(
  propertyId: string
): Promise<Property | null> {
  try {
    const response = await authenticatedApiFetch<ApiLandlordProperty | null>(
      `/properties/me/${encodeURIComponent(propertyId)}`
    )

    return response.data ? normalizeProperty(response.data) : null
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}
