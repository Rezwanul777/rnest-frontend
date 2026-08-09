import type { PaginationMeta } from "@/types/api"
import type { RentalAgreementStatus } from "@/types/rental-request"
import type { RentalAgreementReview } from "@/types/review"

export type RentalAgreement = {
  id: string
  tenant: { id: string; name: string }
  property: { id: string; title: string }
  review: RentalAgreementReview | null
  status: RentalAgreementStatus
  activatedAt: string | null
  leaseStartDate: string | null
  leaseEndDate: string | null
  createdAt: string
  updatedAt: string
}

export type RentalAgreementListData = {
  meta: PaginationMeta
  agreements: RentalAgreement[]
}
