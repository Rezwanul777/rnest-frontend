import Link from "next/link"
import { ArrowRight, Building2 } from "lucide-react"


import { Button } from "@/components/ui/button"
import { featuredProperties } from "@/data/featured-properties"
import { PropertyCard } from "./property-card"


export function FeaturedProperties() {
  return (
    <section
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      aria-labelledby="featured-heading"
    >
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400">
            <Building2 className="size-4" /> Curated for you
          </p>
          <h2
            id="featured-heading"
            className="mt-2 text-3xl font-semibold tracking-tight"
          >
            Fresh places, ready now
          </h2>
          <p className="mt-2 text-muted-foreground">
            Handpicked homes from verified landlords across Dhaka.
          </p>
        </div>
        <Button variant="ghost" className="w-fit" asChild>
          <Link href="/properties">
            Explore all <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-3">
        {featuredProperties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </section>
  )
}
