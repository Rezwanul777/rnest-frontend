import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import type {
  RentalAgreement,
  RentalAgreementListData,
} from "@/types/rental-agreement"
import type { RentalAgreementStatus } from "@/types/rental-request"

export type LandlordRentalAgreementQuery = {
  page?: number
  limit?: number
  status?: RentalAgreementStatus
}

export type LandlordRentalAgreementList = {
  meta: RentalAgreementListData["meta"]
  agreements: RentalAgreement[]
}

export async function getLandlordRentalAgreements({
  page = 1,
  limit = 8,
  status,
}: LandlordRentalAgreementQuery = {}): Promise<LandlordRentalAgreementList> {
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
