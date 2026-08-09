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
  CalendarDays,
  Eye,
  EyeOff,
  ExternalLink,
  LoaderCircle,
  MapPin,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  AdminPropertyModerationApiError,
  setAdminPropertyAvailability,
} from "@/services/admin-property-management.service"
import type { PaginationMeta } from "@/types/api"
import type { Property } from "@/types/property"

const takaFormatter = new Intl.NumberFormat("en-BD")
const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

type AdminPropertyModerationProps = {
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
    ? `/dashboard/admin/properties?${query}`
    : "/dashboard/admin/properties"
}

export function AdminPropertyModeration({
  initialListings,
  meta,
  activeSearch,
  activeAvailability,
}: AdminPropertyModerationProps) {
  const router = useRouter()
  const [listings, setListings] = React.useState(initialListings)
  const [selectedProperty, setSelectedProperty] =
    React.useState<Property | null>(null)
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  const hasFilters = Boolean(activeSearch || activeAvailability)

  async function confirmModeration() {
    if (!selectedProperty) return

    const target = selectedProperty
    const nextAvailability = !target.isAvailable
    const snapshot = listings

    setPendingId(target.id)
    setListings((current) =>
      activeAvailability
        ? current.filter((property) => property.id !== target.id)
        : current.map((property) =>
            property.id === target.id
              ? { ...property, isAvailable: nextAvailability }
              : property
          )
    )

    try {
      const result = await setAdminPropertyAvailability(
        target.id,
        nextAvailability
      )

      toast.success(
        nextAvailability ? "Property published" : "Property hidden",
        {
          description: result.message,
        }
      )
      setSelectedProperty(null)
      router.refresh()
    } catch (error) {
      setListings(snapshot)
      toast.error("Moderation action failed", {
        description:
          error instanceof AdminPropertyModerationApiError
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Admin workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Property moderation
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Inspect every landlord listing, search platform content, and control
            whether a property appears in the public marketplace.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {meta.total} {meta.total === 1 ? "property" : "properties"}
        </Badge>
      </section>

      <Card className="bg-card/90">
        <CardContent className="py-4">
          <form
            action="/dashboard/admin/properties"
            method="get"
            className="grid gap-3 sm:grid-cols-[minmax(16rem,1fr)_200px_auto]"
          >
            <label className="relative">
              <span className="sr-only">Search properties</span>
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                defaultValue={activeSearch}
                placeholder="Search title, location, category..."
                className="h-10 pl-9"
              />
            </label>
            <label>
              <span className="sr-only">Public visibility</span>
              <select
                name="isAvailable"
                defaultValue={activeAvailability ?? ""}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All visibility</option>
                <option value="true">Published</option>
                <option value="false">Hidden</option>
              </select>
            </label>
            <div className="flex gap-2">
              <Button type="submit" className="h-10 flex-1">
                Apply filters
              </Button>
              {hasFilters && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  className="h-10 w-10"
                  asChild
                >
                  <Link
                    href="/dashboard/admin/properties"
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

      {listings.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Building2 className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No properties found</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {hasFilters
              ? "No platform listings match the current search and visibility filter."
              : "No landlord properties are currently available for moderation."}
          </p>
          {hasFilters && (
            <Button className="mt-5" variant="outline" asChild>
              <Link href="/dashboard/admin/properties">
                <RotateCcw /> Clear filters
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {listings.map((property) => {
            const isUpdating = pendingId === property.id

            return (
              <Card
                key={property.id}
                className={`overflow-hidden bg-card/90 ${
                  isUpdating ? "opacity-60" : ""
                }`}
              >
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
                    {property.isAvailable ? (
                      <>
                        <Eye /> Published
                      </>
                    ) : (
                      <>
                        <EyeOff /> Hidden
                      </>
                    )}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="absolute top-3 right-3 bg-background/90 backdrop-blur"
                  >
                    <ShieldCheck /> Moderation
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
                    <MapPin className="size-4 shrink-0 text-amber-500" />
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

                  <div className="mt-4 space-y-2 rounded-xl border bg-muted/35 p-3 text-xs text-muted-foreground">
                    <p className="flex items-center gap-2">
                      <UserRound className="size-3.5" />
                      <span className="truncate font-mono">
                        Landlord: {property.landlordId ?? "Not provided"}
                      </span>
                    </p>
                    <p className="flex items-center gap-2">
                      <CalendarDays className="size-3.5" />
                      Added{" "}
                      {property.createdAt
                        ? dateFormatter.format(new Date(property.createdAt))
                        : "date unavailable"}
                    </p>
                  </div>

                  <p className="mt-5 text-2xl font-semibold text-amber-600 dark:text-amber-400">
                    ৳{takaFormatter.format(property.rent)}
                    <span className="text-xs font-normal text-muted-foreground">
                      {" "}
                      /month
                    </span>
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t pt-4">
                    <Button
                      type="button"
                      size="sm"
                      variant={property.isAvailable ? "destructive" : "default"}
                      disabled={pendingId !== null}
                      onClick={() => setSelectedProperty(property)}
                    >
                      {isUpdating ? (
                        <LoaderCircle className="animate-spin" />
                      ) : property.isAvailable ? (
                        <EyeOff />
                      ) : (
                        <Eye />
                      )}
                      {property.isAvailable
                        ? "Hide listing"
                        : "Publish listing"}
                    </Button>

                    {property.isAvailable ? (
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/properties/${property.id}`}>
                          <ExternalLink /> View public page
                        </Link>
                      </Button>
                    ) : (
                      <Badge variant="outline">Not public</Badge>
                    )}
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
          aria-label="Property moderation pagination"
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

      <Dialog
        open={Boolean(selectedProperty)}
        onOpenChange={(open) => {
          if (!open && pendingId === null) setSelectedProperty(null)
        }}
      >
        <DialogContent showCloseButton={pendingId === null}>
          <DialogHeader>
            <span
              className={`mb-2 flex size-11 items-center justify-center rounded-xl ${
                selectedProperty?.isAvailable
                  ? "bg-destructive/10 text-destructive"
                  : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {selectedProperty?.isAvailable ? (
                <EyeOff className="size-5" />
              ) : (
                <Eye className="size-5" />
              )}
            </span>
            <DialogTitle>
              {selectedProperty?.isAvailable
                ? "Hide this property?"
                : "Publish this property?"}
            </DialogTitle>
            <DialogDescription>
              {selectedProperty?.isAvailable
                ? `“${selectedProperty.title}” will disappear from public browsing and tenants will not be able to send new requests.`
                : `“${selectedProperty?.title}” will become visible in public browsing and tenants can open its details.`}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={pendingId !== null}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              variant={
                selectedProperty?.isAvailable ? "destructive" : "default"
              }
              disabled={pendingId !== null}
              onClick={confirmModeration}
            >
              {pendingId ? (
                <LoaderCircle className="animate-spin" />
              ) : selectedProperty?.isAvailable ? (
                <EyeOff />
              ) : (
                <Eye />
              )}
              {selectedProperty?.isAvailable
                ? "Hide property"
                : "Publish property"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
