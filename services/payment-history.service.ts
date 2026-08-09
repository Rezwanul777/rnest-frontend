import "server-only"

import { authenticatedApiFetch } from "@/services/authenticated-api-client"
import type { PaymentListData, PaymentStatus } from "@/types/payment"

export type PaymentHistoryQuery = {
  page?: number
  limit?: number
  status?: PaymentStatus
}

export async function getPaymentHistory({
  page = 1,
  limit = 100,
  status,
}: PaymentHistoryQuery = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sortBy: "paidAt",
    sortOrder: "desc",
  })

  if (status) params.set("status", status)

  const response = await authenticatedApiFetch<PaymentListData>(
    `/payments?${params}`
  )

  return response.data
}

function paymentAmount(value: number | string) {
  const amount = Number(value)
  return Number.isFinite(amount) ? amount : 0
}

export async function getPaidPaymentSummary() {
  const firstPage = await getPaymentHistory({ status: "PAID" })
  const remainingPages = await Promise.all(
    Array.from(
      { length: Math.max(0, firstPage.meta.totalPages - 1) },
      (_, index) => getPaymentHistory({ page: index + 2, status: "PAID" })
    )
  )

  const payments = [firstPage, ...remainingPages].flatMap(
    (page) => page.payments
  )

  return {
    totalPayments: firstPage.meta.total,
    totalAmount: payments.reduce(
      (total, payment) => total + paymentAmount(payment.amount),
      0
    ),
  }
}
