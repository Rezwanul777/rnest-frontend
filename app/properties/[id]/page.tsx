import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  Bath,
  BedDouble,
  CheckCircle2,
  MapPin,
  Maximize2,
  ShieldCheck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getPropertyById } from "@/services/property.service"

export const dynamic = "force-dynamic"

type PropertyDetailsPageProps = {
  params: Promise<{ id: string }>
}

const taka = new Intl.NumberFormat("en-BD")

export async function generateMetadata({
  params,
}: PropertyDetailsPageProps): Promise<Metadata> {
  const { id } = await params
  const property = await getPropertyById(id)

  if (!property) return { title: "Property not found" }

  return {
    title: property.title,
    description: property.description,
  }
}

export default async function PropertyDetailsPage({
  params,
}: PropertyDetailsPageProps) {
  const { id } = await params
  const property = await getPropertyById(id)

  if (!property) notFound()

  const gallery =
    property.images.length > 0 ? property.images : [property.image]

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Badge variant="outline">{property.category.name}</Badge>
        <Badge variant="secondary">
          <CheckCircle2 /> Available now
        </Badge>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="relative min-h-[360px] overflow-hidden rounded-3xl border sm:min-h-[520px]">
          <Image
            src={gallery[0]}
            alt={property.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover"
            unoptimized={gallery[0].startsWith("http")}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
          {gallery.slice(1, 3).map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="relative min-h-40 overflow-hidden rounded-3xl border"
            >
              <Image
                src={image}
                alt={`${property.title} view ${index + 2}`}
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover"
                unoptimized={image.startsWith("http")}
              />
            </div>
          ))}
          {gallery.length === 1 && (
            <Card className="col-span-2 items-center justify-center rounded-3xl p-8 text-center text-sm text-muted-foreground lg:col-span-1">
              More property photos will be added soon.
            </Card>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 text-amber-500" /> {property.location}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {property.title}
          </h1>

          <div className="mt-7 flex flex-wrap gap-3">
            <Badge variant="secondary" className="px-3 py-2">
              <BedDouble /> {property.bedrooms ?? "—"} bedrooms
            </Badge>
            <Badge variant="secondary" className="px-3 py-2">
              <Bath /> {property.bathrooms ?? "—"} bathrooms
            </Badge>
            <Badge variant="secondary" className="px-3 py-2">
              <Maximize2 />{" "}
              {property.size ? `${property.size} sq ft` : "Size not listed"}
            </Badge>
          </div>

          <div className="mt-10 border-t pt-8">
            <h2 className="text-2xl font-semibold">About this property</h2>
            <p className="mt-4 leading-8 whitespace-pre-line text-muted-foreground">
              {property.description}
            </p>
          </div>

          <div className="mt-10 border-t pt-8">
            <h2 className="text-2xl font-semibold">Amenities</h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <Badge key={amenity} variant="outline" className="px-3 py-2">
                  <CheckCircle2 className="text-emerald-500" /> {amenity}
                </Badge>
              ))}
              {property.amenities.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No amenities have been listed.
                </p>
              )}
            </div>
          </div>
        </section>

        <aside>
          <Card className="sticky top-24 rounded-3xl p-6 shadow-xl">
            <p className="text-sm text-muted-foreground">Monthly rent</p>
            <p className="mt-1 text-3xl font-semibold text-amber-600 dark:text-amber-400">
              ৳{taka.format(property.rent)}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                /month
              </span>
            </p>
            <div className="my-6 border-t" />
            <div className="flex items-start gap-3 rounded-2xl bg-muted/60 p-4">
              <ShieldCheck className="mt-0.5 size-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium">Protected rental request</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Sign in before sending your request to the landlord.
                </p>
              </div>
            </div>
            <Button className="mt-6 w-full" size="lg" asChild>
              <Link href={`/auth/login?redirect=/properties/${property.id}`}>
                Request to rent
              </Link>
            </Button>
          </Card>
        </aside>
      </div>
    </main>
  )
}
