import { apiFetch, ApiError } from "@/services/api-client"
import type {
  Category,
  Property,
  PropertyListData,
  PropertyQuery,
} from "@/types/property"

type ApiProperty = Omit<Property, "rent" | "size" | "image" | "category"> & {
  rent: number | string
  size: number | string | null
  images?: string[]
  category?: Category
  categoryId?: string
}

type ApiPropertyListData = {
  listings: ApiProperty[]
  meta: PropertyListData["meta"]
}

const PROPERTY_PLACEHOLDER = "/property-placeholder.svg"

function toNumber(value: number | string | null | undefined) {
  if (value === null || value === undefined) return null

  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeProperty(property: ApiProperty): Property {
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

function createPropertyQuery(query: PropertyQuery) {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      if (value.length > 0) params.set(key, value.join(","))
      return
    }

    if (value !== undefined && value !== "") {
      params.set(key, value)
    }
  })

  const queryString = params.toString()
  return queryString ? `?${queryString}` : ""
}

export async function getProperties(
  query: PropertyQuery = {}
): Promise<PropertyListData> {
  const response = await apiFetch<ApiPropertyListData>(
    `/properties${createPropertyQuery(query)}`,
    { revalidate: 60 }
  )

  return {
    listings: response.data.listings.map(normalizeProperty),
    meta: response.data.meta,
  }
}

export async function getFeaturedProperties(): Promise<Property[]> {
  const result = await getFeaturedPropertyData()

  return result.listings
}

export async function getFeaturedPropertyData(): Promise<PropertyListData> {
  return getProperties({
    page: "1",
    limit: "6",
    sortBy: "createdAt",
    sortOrder: "desc",
  })
}

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const response = await apiFetch<ApiProperty>(`/properties/${id}`, {
      revalidate: 60,
    })

    return normalizeProperty(response.data)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function getPropertyAmenities(): Promise<string[]> {
  const result = await getProperties({
    page: "1",
    limit: "100",
    sortBy: "title",
    sortOrder: "asc",
  })

  return [...new Set(result.listings.flatMap((item) => item.amenities))].sort(
    (a, b) => a.localeCompare(b)
  )
}
