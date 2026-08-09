import type { Metadata } from "next"

import { AdminRentalRequestOversight } from "@/components/dashboard/admin-rental-request-oversight"
import { requireRole } from "@/lib/require-role"
import { getAdminRentalRequests } from "@/services/admin-rental-request.service"
import type { RentalRequestStatus } from "@/types/rental-request"

export const metadata: Metadata = {
  title: "Rental request oversight",
}

const requestStatuses = new Set<RentalRequestStatus>([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
])

type AdminRequestsPageProps = {
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
  return value && requestStatuses.has(value as RentalRequestStatus)
    ? (value as RentalRequestStatus)
    : undefined
}

export default async function AdminRequestsPage({
  searchParams,
}: AdminRequestsPageProps) {
  await requireRole("ADMIN")

  const query = await searchParams
  const page = parsePage(query.page)
  const search = query.search?.trim().slice(0, 100) ?? ""
  const status = parseStatus(query.status)
  const { requests, meta } = await getAdminRentalRequests({
    page,
    search,
    status,
  })

  return (
    <AdminRentalRequestOversight
      requests={requests}
      meta={meta}
      activeSearch={search}
      activeStatus={status}
    />
  )
}
