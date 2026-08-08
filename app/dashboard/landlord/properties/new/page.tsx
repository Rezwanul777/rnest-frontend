import { CreatePropertyForm } from "@/components/dashboard/create-property-form"
import { Badge } from "@/components/ui/badge"
import { requireRole } from "@/lib/require-role"
import { getCategories } from "@/services/category.service"

export const metadata = {
  title: "Add Property",
}

export default async function NewLandlordPropertyPage() {
  await requireRole("LANDLORD")
  const categories = await getCategories()

  return (
    <div className="mx-auto max-w-4xl space-y-7">
      <section>
        <Badge variant="outline">Landlord workspace</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Add a new property
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Publish a complete rental listing. Fields marked with an asterisk are
          required by RentNest.
        </p>
      </section>

      <CreatePropertyForm categories={categories} />
    </div>
  )
}
