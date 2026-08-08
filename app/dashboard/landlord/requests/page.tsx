import { LandlordRentalRequestList } from "@/components/dashboard/landlord-rental-request-list"
import { requireRole } from "@/lib/require-role"
import { getLandlordRentalRequests } from "@/services/landlord-rental-request.service"
import type { RentalRequestStatus } from "@/types/rental-request"

const rentalRequestStatuses = new Set<RentalRequestStatus>([
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
])

type LandlordRequestsPageProps = {
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

export default async function LandlordRequestsPage({
  searchParams,
}: LandlordRequestsPageProps) {
  await requireRole("LANDLORD")

  const query = await searchParams
  const page = parsePage(query.page)
  const status = parseStatus(query.status)
  const { requests, meta } = await getLandlordRentalRequests({ page, status })
  const listKey = `${meta.page}-${status ?? "ALL"}-${requests
    .map((request) => `${request.id}:${request.status}`)
    .join("|")}`

  return (
    <LandlordRentalRequestList
      key={listKey}
      initialRequests={requests}
      meta={meta}
      activeStatus={status}
    />
  )
}
