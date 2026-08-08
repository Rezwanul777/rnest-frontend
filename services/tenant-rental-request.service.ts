import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import type { PaginationMeta } from "@/types/api"
import type { RentalRequest, RentalRequestStatus } from "@/types/rental-request"

export type TenantRentalRequestQuery = {
  page?: number
  limit?: number
  status?: RentalRequestStatus
}

export type TenantRentalRequestList = {
  meta: PaginationMeta
  requests: RentalRequest[]
}

export async function getTenantRentalRequests({
  page = 1,
  limit = 8,
  status,
}: TenantRentalRequestQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  if (status) params.set("status", status)

  const response = await authenticatedApiFetch<TenantRentalRequestList>(
    `/rental-requests?${params}`
  )

  return response.data
}
