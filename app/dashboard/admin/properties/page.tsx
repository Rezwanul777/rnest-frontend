import type { Metadata } from "next"

import { AdminPropertyModeration } from "@/components/dashboard/admin-property-moderation"
import { requireRole } from "@/lib/require-role"
import { getAdminProperties } from "@/services/admin-property.service"

export const metadata: Metadata = {
  title: "Property moderation",
}

type AdminPropertiesPageProps = {
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

export default async function AdminPropertiesPage({
  searchParams,
}: AdminPropertiesPageProps) {
  await requireRole("ADMIN")

  const query = await searchParams
  const page = parsePage(query.page)
  const search = query.search?.trim().slice(0, 100) ?? ""
  const isAvailable = parseAvailability(query.isAvailable)
  const { listings, meta } = await getAdminProperties({
    page,
    search,
    isAvailable,
  })

  return (
    <AdminPropertyModeration
      initialListings={listings}
      meta={meta}
      activeSearch={search}
      activeAvailability={isAvailable}
    />
  )
}
