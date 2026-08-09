import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Bath, BedDouble, Heart, MapPin } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Property } from "@/types/property"

type PropertyCardProps = {
  property: Property
}

const taka = new Intl.NumberFormat("en-BD")

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Card className="group overflow-hidden rounded-2xl transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-amber-400/45 hover:shadow-[0_22px_55px_-28px_rgba(245,158,11,0.55)]">
      <div className="grid min-h-64 sm:grid-cols-[44%_1fr]">
        <div className="relative min-h-56 overflow-hidden sm:min-h-full">
          <Image
            src={property.image}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 44vw, 220px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={property.image.startsWith("http")}
          />
          <Badge
            variant="success"
            className="absolute top-3 left-3 bg-background/85 backdrop-blur"
          >
            {property.isAvailable ? "Available" : "Occupied"}
          </Badge>
        </div>

        <div className="flex flex-col p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                {property.category.name}
              </p>
              <h3 className="mt-1 text-lg font-semibold tracking-tight">
                <Link
                  href={`/properties/${property.id}`}
                  className="decoration-amber-500 decoration-2 underline-offset-4 group-hover:underline"
                >
                  {property.title}
                </Link>
              </h3>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="relative z-10 -mt-1 -mr-1 rounded-full"
              aria-label={`Save ${property.title}`}
            >
              <Heart />
            </Button>
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="size-4" /> {property.location}
          </p>

          <div className="mt-4 flex items-center gap-4 border-y py-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <BedDouble className="size-4" /> {property.bedrooms ?? "—"} Beds
            </span>
            <span className="flex items-center gap-1.5">
              <Bath className="size-4" /> {property.bathrooms ?? "—"} Baths
            </span>
          </div>

          <div className="mt-auto pt-4">
            <div>
              <span className="text-xl font-semibold text-amber-600 dark:text-amber-400">
                ৳{taka.format(property.rent)}
              </span>
              <span className="text-xs text-muted-foreground"> /month</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="mt-4 w-full transition-colors group-hover:border-amber-500 group-hover:bg-amber-500 group-hover:text-slate-950"
              asChild
            >
              <Link href={`/properties/${property.id}`}>
                View details
                <ArrowUpRight className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
