"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Bath,
  BedDouble,
  Building2,
  ExternalLink,
  LoaderCircle,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import {
  PropertyManagementApiError,
  togglePropertyAvailability,
  deleteLandlordProperty,
} from "@/services/property-management.service"
import type { PaginationMeta } from "@/types/api"
import type { Property } from "@/types/property"

const takaFormatter = new Intl.NumberFormat("en-BD")

type LandlordPropertyListProps = {
  initialListings: Property[]
  meta: PaginationMeta
  activeSearch: string
  activeAvailability?: "true" | "false"
}

function createPageHref(
  page: number,
  search: string,
  availability?: "true" | "false"
) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (search) params.set("search", search)
  if (availability) params.set("isAvailable", availability)

  const query = params.toString()
  return query
    ? `/dashboard/landlord/properties?${query}`
    : "/dashboard/landlord/properties"
}

export function LandlordPropertyList({
  initialListings,
  meta,
  activeSearch,
  activeAvailability,
}: LandlordPropertyListProps) {
  const router = useRouter()
  const [listings, setListings] = React.useState(initialListings)
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  async function changeAvailability(propertyId: string) {
    const snapshot = listings
    const property = listings.find((item) => item.id === propertyId)
    if (!property) return

    setPendingId(propertyId)
    setListings((current) =>
      current.map((item) =>
        item.id === propertyId
          ? { ...item, isAvailable: !item.isAvailable }
          : item
      )
    )

    try {
      const result = await togglePropertyAvailability(propertyId)
      toast.success("Availability updated", { description: result.message })
      router.refresh()
    } catch (error) {
      setListings(snapshot)
      toast.error("Availability update failed", {
        description:
          error instanceof PropertyManagementApiError
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setPendingId(null)
    }
  }

  async function handleDelete(propertyId: string, title: string) {
    if (!confirm(`Are you sure you want to remove "${title}"?`)) return

    const snapshot = listings
    setPendingId(propertyId)
    setListings((current) => current.filter((item) => item.id !== propertyId))

    try {
      await deleteLandlordProperty(propertyId)
      toast.success("Property removed", {
        description: `"${title}" has been deleted from your listings.`,
      })
      router.refresh()
    } catch (error) {
      setListings(snapshot)
      toast.error("Failed to delete property", {
        description:
          error instanceof PropertyManagementApiError
            ? error.message
            : "Something went wrong while removing the listing.",
      })
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Landlord workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            My properties
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Search your listings and control whether tenants can request them.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <Plus /> Add property
          </Link>
        </Button>
      </section>

      <Card className="bg-card/90">
        <CardContent className="py-4">
          <form
            action="/dashboard/landlord/properties"
            method="get"
            className="grid gap-3 sm:grid-cols-[1fr_190px_auto]"
          >
            <label className="relative">
              <span className="sr-only">Search properties</span>
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                defaultValue={activeSearch}
                placeholder="Search title, location, description..."
                className="h-10 pl-9"
              />
            </label>
            <label>
              <span className="sr-only">Availability</span>
              <select
                name="isAvailable"
                defaultValue={activeAvailability ?? ""}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All availability</option>
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>
            </label>
            <div className="flex gap-2">
              <Button type="submit" className="h-10 flex-1">
                Apply filters
              </Button>
              {(activeSearch || activeAvailability) && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  className="h-10 w-10"
                  asChild
                >
                  <Link
                    href="/dashboard/landlord/properties"
                    aria-label="Clear property filters"
                  >
                    <RotateCcw />
                  </Link>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {meta.total} {meta.total === 1 ? "property" : "properties"}
        </p>
      </div>

      {listings.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Building2 className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No properties found</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {activeSearch || activeAvailability
              ? "No listings match your current filters."
              : "Create your first RentNest listing to start receiving tenant requests."}
          </p>
          <Button className="mt-5" asChild>
            <Link href="/dashboard/landlord/properties/new">
              <Plus /> Add property
            </Link>
          </Button>
        </Card>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((property) => {
            const isUpdating = pendingId === property.id

            return (
              <Card key={property.id} className="overflow-hidden bg-card/90">
                <div className="relative aspect-[16/10] overflow-hidden border-b">
                  <Image
                    src={property.image}
                    alt={property.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 hover:scale-105"
                    unoptimized={property.image.startsWith("http")}
                  />
                  <Badge
                    variant={property.isAvailable ? "success" : "secondary"}
                    className="absolute top-3 left-3 bg-background/90 backdrop-blur"
                  >
                    {property.isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <CardContent className="flex flex-1 flex-col py-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
                        {property.category.name}
                      </p>
                      <h2 className="mt-1 line-clamp-2 text-lg font-semibold">
                        {property.title}
                      </h2>
                    </div>
                    {isUpdating && (
                      <LoaderCircle className="size-4 shrink-0 animate-spin text-muted-foreground" />
                    )}
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <MapPin className="size-4 text-amber-500" />
                    <span className="truncate">{property.location}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                      <BedDouble className="size-3.5" />
                      {property.bedrooms ?? "—"} beds
                    </span>
                    <span className="flex items-center gap-1 rounded-md bg-muted px-2 py-1">
                      <Bath className="size-3.5" />
                      {property.bathrooms ?? "—"} baths
                    </span>
                  </div>

                  <p className="mt-5 text-2xl font-semibold text-amber-600 dark:text-amber-400">
                    ৳{takaFormatter.format(property.rent)}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}
                      /month
                    </span>
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-2 border-t pt-4">
                    <label className="flex items-center gap-2 text-sm font-medium">
                      <Switch
                        checked={property.isAvailable}
                        disabled={pendingId !== null}
                        onCheckedChange={() => changeAvailability(property.id)}
                        aria-label={`Set ${property.title} availability`}
                      />
                      Available
                    </label>

                    <div className="flex items-center gap-1.5">
                      <Button variant="outline" size="icon-sm" asChild title="Edit listing">
                        <Link href={`/dashboard/landlord/properties/${property.id}/edit`}>
                          <Pencil className="size-3.5" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:bg-destructive/10"
                        title="Delete listing"
                        disabled={pendingId !== null}
                        onClick={() => handleDelete(property.id, property.title)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                      {property.isAvailable && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/properties/${property.id}`}>
                            View <ExternalLink className="size-3.5 ml-1" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      )}

      {meta.totalPages > 1 && (
        <nav
          className="flex items-center justify-between border-t pt-5"
          aria-label="Property pagination"
        >
          <Button
            variant="outline"
            disabled={meta.page <= 1}
            asChild={meta.page > 1}
          >
            {meta.page > 1 ? (
              <Link
                href={createPageHref(
                  meta.page - 1,
                  activeSearch,
                  activeAvailability
                )}
              >
                <ArrowLeft /> Previous
              </Link>
            ) : (
              <span>
                <ArrowLeft /> Previous
              </span>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </p>
          <Button
            variant="outline"
            disabled={meta.page >= meta.totalPages}
            asChild={meta.page < meta.totalPages}
          >
            {meta.page < meta.totalPages ? (
              <Link
                href={createPageHref(
                  meta.page + 1,
                  activeSearch,
                  activeAvailability
                )}
              >
                Next <ArrowRight />
              </Link>
            ) : (
              <span>
                Next <ArrowRight />
              </span>
            )}
          </Button>
        </nav>
      )}
    </div>
  )
}
