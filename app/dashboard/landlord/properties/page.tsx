import { LandlordPropertyList } from "@/components/dashboard/landlord-property-list"
import { requireRole } from "@/lib/require-role"
import { getLandlordProperties } from "@/services/landlord-property.service"

type LandlordPropertiesPageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    isAvailable?: string
  }>
}

function parsePage(value?: string) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function parseAvailability(value?: string) {
  return value === "true" || value === "false" ? value : undefined
}

export default async function LandlordPropertiesPage({
  searchParams,
}: LandlordPropertiesPageProps) {
  await requireRole("LANDLORD")

  const query = await searchParams
  const page = parsePage(query.page)
  const search = query.search?.trim().slice(0, 150) ?? ""
  const isAvailable = parseAvailability(query.isAvailable)
  const { listings, meta } = await getLandlordProperties({
    page,
    search,
    isAvailable,
  })
  const listKey = `${meta.page}-${search}-${isAvailable ?? "ALL"}-${listings
    .map((property) => `${property.id}:${property.isAvailable}`)
    .join("|")}`

  return (
    <LandlordPropertyList
      key={listKey}
      initialListings={listings}
      meta={meta}
      activeSearch={search}
      activeAvailability={isAvailable}
    />
  )
}
