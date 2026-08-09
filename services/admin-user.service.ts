import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import type { AdminUserListData } from "@/types/admin"
import type { UserRole } from "@/types/auth"

export type AdminUserQuery = {
  page?: number
  limit?: number
  search?: string
  role?: UserRole
  isActive?: "true" | "false"
}

export async function getAdminUsers({
  page = 1,
  limit = 8,
  search,
  role,
  isActive,
}: AdminUserQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  if (search) params.set("search", search)
  if (role) params.set("role", role)
  if (isActive) params.set("isActive", isActive)

  const response = await authenticatedApiFetch<AdminUserListData>(
    `/admin/users?${params}`
  )

  return response.data
}
