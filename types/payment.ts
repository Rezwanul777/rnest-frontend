import type { PaginationMeta } from "@/types/api"
import type { RentalAgreementStatus } from "@/types/rental-request"

export type PaymentStatus =
  "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED" | "CANCELLED"

export type Payment = {
  id: string
  rentalAgreementId: string
  amount: number | string
  currency: string
  status: PaymentStatus
  provider: "STRIPE"
  stripeSessionId?: string | null
  stripePaymentIntentId?: string | null
  failureReason?: string | null
  rentalAgreement?: {
    id: string
    status: RentalAgreementStatus
    review?: {
      id: string
    } | null
    tenant: {
      id: string
      name: string
      email: string
    }
    property: {
      id: string
      title: string
      location: string
      rent: number | string
    }
  }
  paidAt: string | null
  createdAt: string
  updatedAt: string
}

export type PaymentListData = {
  meta: PaginationMeta
  payments: Payment[]
}
