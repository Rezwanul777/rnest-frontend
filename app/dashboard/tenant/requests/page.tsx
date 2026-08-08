import { TenantRentalRequestList } from "@/components/dashboard/tenant-rental-request-list"
import { requireRole } from "@/lib/require-role"
import { getTenantRentalRequests } from "@/services/tenant-rental-request.service"
import type { RentalRequestStatus } from "@/types/rental-request"

const rentalRequestStatuses = new Set<RentalRequestStatus>([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
])

type TenantRequestsPageProps = {
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
  return value && rentalRequestStatuses.has(value as RentalRequestStatus)
    ? (value as RentalRequestStatus)
    : undefined
}

export default async function TenantRequestsPage({
  searchParams,
}: TenantRequestsPageProps) {
  await requireRole("TENANT")

  const query = await searchParams
  const page = parsePage(query.page)
  const status = parseStatus(query.status)
  const { requests, meta } = await getTenantRentalRequests({ page, status })

  return (
    <TenantRentalRequestList
      requests={requests}
      meta={meta}
      activeStatus={status}
    />
  )
}
