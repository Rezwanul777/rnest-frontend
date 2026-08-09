import type { Metadata } from "next"

import { TenantPaymentHistory } from "@/components/dashboard/tenant-payment-history"
import { requireRole } from "@/lib/require-role"
import { getPaymentHistory } from "@/services/payment-history.service"
import type { PaymentStatus } from "@/types/payment"

export const metadata: Metadata = {
  title: "Payment history",
}

const paymentStatuses = new Set<PaymentStatus>([
  "PENDING",
  "PROCESSING",
  "PAID",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
])

type TenantPaymentsPageProps = {
  searchParams: Promise<{
    page?: string
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

export default async function TenantPaymentsPage({
  searchParams,
}: TenantPaymentsPageProps) {
  await requireRole("TENANT")

  const query = await searchParams
  const page = parsePage(query.page)
  const status = parseStatus(query.status)
  const { payments, meta } = await getPaymentHistory({ page, status })

  return (
    <TenantPaymentHistory
      payments={payments}
      meta={meta}
      activeStatus={status}
    />
  )
}
