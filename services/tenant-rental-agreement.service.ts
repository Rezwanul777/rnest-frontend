import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import type { RentalAgreementListData } from "@/types/rental-agreement"
import type { RentalAgreementStatus } from "@/types/rental-request"

type TenantRentalAgreementQuery = {
  page?: number
  limit?: number
  status?: RentalAgreementStatus
}

export async function getTenantRentalAgreements({
  page = 1,
  limit = 8,
  status,
}: TenantRentalAgreementQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "createdAt",
    sortOrder: "desc",
  })

  if (status) params.set("status", status)

  const response = await authenticatedApiFetch<RentalAgreementListData>(
    `/rental-agreements?${params}`
  )

  return response.data
}
