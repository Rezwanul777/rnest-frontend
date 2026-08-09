import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  Clock3,
  Eye,
  Inbox,
  MapPin,
  Plus,
} from "lucide-react"

import { RentalRequestStatusBadge } from "@/components/dashboard/rental-request-status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { RentalRequest } from "@/types/rental-request"

const numberFormatter = new Intl.NumberFormat("en-BD")
const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

type LandlordOverviewProps = {
  userName: string
  totalProperties: number
  availableProperties: number
  pendingRequests: number
  confirmedEarnings: number
  recentRequests: RentalRequest[]
}

export function LandlordOverview({
  userName,
  totalProperties,
  availableProperties,
  pendingRequests,
  confirmedEarnings,
  recentRequests,
}: LandlordOverviewProps) {
  const stats = [
    {
      label: "Total properties",
      value: numberFormatter.format(totalProperties),
      helper: "Listings in your portfolio",
      icon: Building2,
      href: "/dashboard/landlord/properties",
    },
    {
      label: "Available listings",
      value: numberFormatter.format(availableProperties),
      helper: "Visible to tenants now",
      icon: Eye,
      href: "/dashboard/landlord/properties?isAvailable=true",
    },
    {
      label: "Pending requests",
      value: numberFormatter.format(pendingRequests),
      helper: "Waiting for your decision",
      icon: Clock3,
      href: "/dashboard/landlord/requests?status=PENDING",
    },
    {
      label: "Confirmed earnings",
      value: `৳${numberFormatter.format(confirmedEarnings)}`,
      helper: "Total successful Stripe payments",
      icon: CircleDollarSign,
      href: "/dashboard/landlord",
    },
  ]

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Landlord workspace</Badge>
          <p className="mt-4 text-sm text-muted-foreground">
            Welcome back, {userName}.
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Rental business overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitor your live listings, tenant requests, and confirmed rental
            income from one place.
          </p>
        </div>
        <Button className="h-10" asChild>
          <Link href="/dashboard/landlord/properties/new">
            <Plus /> Add property
          </Link>
        </Button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, helper, icon: Icon, href }) => (
          <Link key={label} href={href} className="group rounded-xl">
            <Card className="h-full bg-card/90 transition-colors group-hover:border-amber-500/35">
              <CardContent className="py-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Icon className="size-5" />
                  </span>
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
                <p className="mt-6 text-3xl font-semibold tracking-tight">
                  {value}
                </p>
                <p className="mt-2 text-sm font-medium">{label}</p>
                <p className="mt-1 text-xs text-muted-foreground">{helper}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
        <Card className="overflow-hidden bg-card/90">
          <CardContent className="px-0 py-0">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">Recent rental requests</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Latest tenant activity across your properties
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/landlord/requests">
                  View all <ArrowRight />
                </Link>
              </Button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Inbox className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">No rental requests yet</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  New tenant requests will appear here after your properties go
                  live.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {request.property.title}
                      </p>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span>{request.tenant?.name ?? "Tenant"}</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {request.property.location}
                        </span>
                        {request.createdAt && (
                          <span>
                            {dateFormatter.format(new Date(request.createdAt))}
                          </span>
                        )}
                      </p>
                    </div>
                    <RentalRequestStatusBadge status={request.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardContent className="py-5">
            <h2 className="font-semibold">Quick actions</h2>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Common landlord tasks
            </p>
            <div className="mt-5 grid gap-3">
              <Button
                variant="outline"
                className="h-11 justify-between"
                asChild
              >
                <Link href="/dashboard/landlord/properties/new">
                  Add a new property <Plus />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 justify-between"
                asChild
              >
                <Link href="/dashboard/landlord/properties">
                  Manage properties <Building2 />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 justify-between"
                asChild
              >
                <Link href="/dashboard/landlord/requests?status=PENDING">
                  Review pending requests <Clock3 />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
