import type { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  EditPropertyForm,
  type PropertyFormInitialValues,
} from "@/components/dashboard/create-property-form"
import { Badge } from "@/components/ui/badge"
import { requireRole } from "@/lib/require-role"
import { getCategories } from "@/services/category.service"
import { getLandlordPropertyById } from "@/services/landlord-property.service"

type EditLandlordPropertyPageProps = {
  params: Promise<{ id: string }>
}

export const metadata: Metadata = {
  title: "Edit Property",
}

export default async function EditLandlordPropertyPage({
  params,
}: EditLandlordPropertyPageProps) {
  await requireRole("LANDLORD")
  const { id } = await params
  const [property, categories] = await Promise.all([
    getLandlordPropertyById(id),
    getCategories(),
  ])

  if (!property) notFound()

  const initialValues: PropertyFormInitialValues = {
    title: property.title,
    description: property.description,
    rent: property.rent,
    location: property.location,
    categoryId: property.category.id,
    bedrooms: property.bedrooms ?? undefined,
    bathrooms: property.bathrooms ?? undefined,
    size: property.size ?? undefined,
    amenitiesText: property.amenities.join(", "),
    images:
      property.images.length > 0
        ? property.images.map((url) => ({ url }))
        : [{ url: "" }],
  }

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <section>
        <Badge variant="outline">Landlord workspace</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Edit property
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Update {property.title}. Saving this form immediately updates the
          listing in RentNest.
        </p>
      </section>

      <EditPropertyForm
        categories={categories}
        propertyId={property.id}
        initialValues={initialValues}
      />
    </div>
  )
}
