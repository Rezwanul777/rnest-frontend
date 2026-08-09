import type { Metadata } from "next"

import { AdminPaymentOversight } from "@/components/dashboard/admin-payment-oversight"
import { requireRole } from "@/lib/require-role"
import { getPaymentHistory } from "@/services/payment-history.service"
import type { PaymentStatus } from "@/types/payment"

export const metadata: Metadata = {
  title: "Payment oversight",
}

const paymentStatuses = new Set<PaymentStatus>([
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
])

type AdminPaymentsPageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    status?: string
  }>
}

function parsePage(value?: string) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function parseStatus(value?: string) {
  return value && paymentStatuses.has(value as PaymentStatus)
    ? (value as PaymentStatus)
    : undefined
}

export default async function AdminPaymentsPage({
  searchParams,
}: AdminPaymentsPageProps) {
  await requireRole("ADMIN")

  const query = await searchParams
  const page = parsePage(query.page)
  const search = query.search?.trim().slice(0, 100) ?? ""
  const status = parseStatus(query.status)
  const { payments, meta } = await getPaymentHistory({
    page,
    search,
    status,
  })

  return (
    <AdminPaymentOversight
      payments={payments}
      meta={meta}
      activeSearch={search}
      activeStatus={status}
    />
  )
}
