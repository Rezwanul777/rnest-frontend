import type { PaginationMeta } from "@/types/api"

export type Category = {
  id: string
  name: string
  slug?: string
}

export type Property = {
  id: string
  title: string
  description: string
  location: string
  rent: number
  bedrooms: number | null
  bathrooms: number | null
  size: number | null
  image: string
  images: string[]
  category: Category
  categoryId?: string
  amenities: string[]
  isAvailable: boolean
  landlordId?: string
  createdAt?: string
  updatedAt?: string
}

export type PropertyListData = {
  listings: Property[]
  meta: PaginationMeta
}

export type PropertyQuery = {
  page?: string
  limit?: string
  sortBy?: "title" | "rent" | "createdAt" | "updatedAt"
  sortOrder?: "asc" | "desc"
  location?: string
  categoryId?: string
  minRent?: string
  maxRent?: string
  search?: string
  amenities?: string[]
}

