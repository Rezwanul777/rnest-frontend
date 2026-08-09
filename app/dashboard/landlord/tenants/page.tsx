import { LandlordTenantHistory } from "@/components/dashboard/landlord-tenant-history"
import { requireRole } from "@/lib/require-role"
import { getLandlordRentalAgreements } from "@/services/landlord-rental-agreement.service"
import type { RentalAgreementStatus } from "@/types/rental-request"

const agreementStatuses = new Set<RentalAgreementStatus>([
  "PENDING_PAYMENT",
  "ACTIVE",
  "COMPLETED",
  "TERMINATED",
  "CANCELLED",
])

type LandlordTenantsPageProps = {
  searchParams: Promise<{ page?: string; status?: string }>
}

function parsePage(value?: string) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function parseStatus(value?: string) {
  return value && agreementStatuses.has(value as RentalAgreementStatus)
    ? (value as RentalAgreementStatus)
    : undefined
}

export const metadata = { title: "Tenant History" }

export default async function LandlordTenantsPage({
  searchParams,
}: LandlordTenantsPageProps) {
  await requireRole("LANDLORD")

  const query = await searchParams
  const page = parsePage(query.page)
  const status = parseStatus(query.status)
  const { agreements, meta } = await getLandlordRentalAgreements({
    page,
    status,
  })

  return (
    <LandlordTenantHistory
      agreements={agreements}
      meta={meta}
      activeStatus={status}
    />
  )
}
