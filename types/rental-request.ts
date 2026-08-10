export type RentalRequestStatus =
  "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED"

export type RentalAgreementStatus =
  "PENDING_PAYMENT" | "ACTIVE" | "COMPLETED" | "TERMINATED" | "CANCELLED"

export type RentalRequestProperty = {
  id: string
  title: string
  location: string
  rent: number | string
}

export type RentalRequestTenant = {
  id: string
  name: string
  email: string
}

export type RentalAgreementSummary = {
  id: string
  status: RentalAgreementStatus
  leaseEndDate?: string | null
  review?: {
    id: string
  } | null
}

export type SubmitRentalRequestPayload = {
  propertyId: string
  requestedMoveInDate: string
  durationInMonths: number
  tenantMessage?: string
}

export type UpdateRentalRequestStatus = Extract<
  RentalRequestStatus,
  "APPROVED" | "REJECTED"
>

export type RentalRequest = {
  id: string
  tenantId: string
  propertyId: string
  tenantMessage?: string | null
  requestedMoveInDate: string
  durationInMonths: number
  status: RentalRequestStatus
  property: RentalRequestProperty
  tenant?: RentalRequestTenant
  rentalAgreement?: RentalAgreementSummary | null
  createdAt?: string
  updatedAt?: string
}
