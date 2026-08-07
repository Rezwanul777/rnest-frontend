import Image from "next/image"
import Link from "next/link"
import { Bath, BedDouble, Heart, MapPin } from "lucide-react"

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
    <Card className="group overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-amber-400/35 hover:shadow-xl">
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
            variant="secondary"
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
                <Link href={`/properties/${property.id}`}>
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
            <span className="text-xl font-semibold text-amber-600 dark:text-amber-400">
              ৳{taka.format(property.rent)}
            </span>
            <span className="text-xs text-muted-foreground"> /month</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
