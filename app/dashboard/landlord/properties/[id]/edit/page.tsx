import { notFound } from "next/navigation"

import { LandlordPropertyForm } from "@/components/dashboard/landlord-property-form"
import { requireRole } from "@/lib/require-role"
import { getCategories } from "@/services/category.service"
import { getPropertyById } from "@/services/property.service"

type EditPropertyPageProps = {
  params: Promise<{ id: string }>
}

export default async function EditPropertyPage({
  params,
}: EditPropertyPageProps) {
  await requireRole("LANDLORD")

  const { id } = await params
  const [property, categories] = await Promise.all([
    getPropertyById(id),
    getCategories().catch(() => []),
  ])

  if (!property) {
    notFound()
  }

  return (
    <div className="py-6">
      <LandlordPropertyForm
        categories={categories}
        initialProperty={property}
      />
    </div>
  )
}
