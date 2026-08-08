import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import type { PaginationMeta } from "@/types/api"
import type { UserRole } from "@/types/auth"
import type { Property } from "@/types/property"
import type { RentalRequest } from "@/types/rental-request"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: UserRole
  isBanned?: boolean
  createdAt?: string
}

export type AdminUserQuery = {
  page?: number
  limit?: number
  search?: string
  role?: string
}

export type AdminUserListResponse = {
  users: AdminUser[]
  meta: PaginationMeta
}

export async function getAdminUsers({
  page = 1,
  limit = 10,
  search,
  role,
}: AdminUserQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  if (search) params.set("search", search)
  if (role) params.set("role", role)

  const response = await authenticatedApiFetch<AdminUserListResponse | AdminUser[]>(
    `/admin/users?${params}`
  ).catch(async () => {
    // Fallback if backend returns alternative structure
    const altResponse = await authenticatedApiFetch<{ users: AdminUser[]; meta: PaginationMeta }>(
      `/users?${params}`
    )
    return altResponse
  })

  if (Array.isArray(response.data)) {
    return {
      users: response.data,
      meta: { page, limit, total: response.data.length, totalPages: 1 },
    }
  }

  return {
    users: response.data.users ?? [],
    meta: response.data.meta ?? { page, limit, total: 0, totalPages: 1 },
  }
}

export async function getAdminProperties({
  page = 1,
  limit = 10,
  search,
}: { page?: number; limit?: number; search?: string } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })
  if (search) params.set("search", search)

  const response = await authenticatedApiFetch<{
    listings: Property[]
    meta: PaginationMeta
  }>(`/admin/properties?${params}`).catch(async () => {
    const altResponse = await authenticatedApiFetch<{
      listings: Property[]
      meta: PaginationMeta
    }>(`/properties?${params}`)
    return altResponse
  })

  return {
    listings: response.data.listings ?? [],
    meta: response.data.meta ?? { page, limit, total: 0, totalPages: 1 },
  }
}

export async function getAdminRequests({
  page = 1,
  limit = 10,
}: { page?: number; limit?: number } = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  })

  const response = await authenticatedApiFetch<{
    requests: RentalRequest[]
    meta: PaginationMeta
  }>(`/admin/requests?${params}`).catch(async () => {
    const altResponse = await authenticatedApiFetch<{
      requests: RentalRequest[]
      meta: PaginationMeta
    }>(`/rental-requests?${params}`)
    return altResponse
  })

  return {
    requests: response.data.requests ?? [],
    meta: response.data.meta ?? { page, limit, total: 0, totalPages: 1 },
  }
}
