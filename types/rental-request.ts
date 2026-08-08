import type { Property } from "@/types/property"

export type RentalRequestStatus =
  "PENDING" | "APPROVED" | "REJECTED" | "ACTIVE" | "COMPLETED"

export type SubmitRentalRequestPayload = {
  propertyId: string
  requestedMoveInDate: string
  durationInMonths: number
  tenantMessage?: string
}

export type RentalRequest = {
  id: string
  tenantId: string
  propertyId: string
  tenantMessage?: string | null
  requestedMoveInDate: string
  durationInMonths: number
  status: RentalRequestStatus
  property?: Property
  createdAt?: string
  updatedAt?: string
}
