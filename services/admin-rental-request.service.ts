import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import type { PaginationMeta } from "@/types/api"
import type { RentalRequest, RentalRequestStatus } from "@/types/rental-request"

type AdminRentalRequestList = {
  meta: PaginationMeta
  requests: RentalRequest[]
}

export type AdminRentalRequestQuery = {
  page?: number
  limit?: number
  search?: string
  status?: RentalRequestStatus
}

export async function getAdminRentalRequests({
  page = 1,
  limit = 8,
  search,
  status,
}: AdminRentalRequestQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  if (search) params.set("search", search)
  if (status) params.set("status", status)

  const response = await authenticatedApiFetch<AdminRentalRequestList>(
    `/rental-requests?${params}`
  )

  return response.data
}
