import type { PaginationMeta } from "@/types/api"

export type PaymentStatus =
  "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "REFUNDED"

export type Payment = {
  id: string
  rentalAgreementId: string
  amount: number | string
  currency: string
  status: PaymentStatus
  provider?: string
  paidAt?: string | null
  createdAt?: string
  updatedAt?: string
}

export type PaymentListData = {
  meta: PaginationMeta
  payments: Payment[]
}
