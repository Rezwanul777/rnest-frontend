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

export async function getTenantRentalAgreementById(agreementId: string) {
  const firstPage = await getTenantRentalAgreements({ limit: 100 })
  const agreement = firstPage.agreements.find((item) => item.id === agreementId)

  if (agreement) return agreement

  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.max(0, firstPage.meta.totalPages - 1) },
      (_, index) => getTenantRentalAgreements({ page: index + 2, limit: 100 })
    )
  )

  return (
    remainingPages
      .flatMap((page) => page.agreements)
      .find((item) => item.id === agreementId) ?? null
  )
}
