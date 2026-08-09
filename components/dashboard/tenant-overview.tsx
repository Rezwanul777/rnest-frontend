import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  Home,
  MapPin,
  ReceiptText,
  Search,
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

type TenantOverviewProps = {
  userName: string
  totalRequests: number
  approvedRequests: number
  activeRentals: number
  totalPaid: number
  successfulPayments: number
  recentRequests: RentalRequest[]
}

export function TenantOverview({
  userName,
  totalRequests,
  approvedRequests,
  activeRentals,
  totalPaid,
  successfulPayments,
  recentRequests,
}: TenantOverviewProps) {
  const stats = [
    {
      label: "Rental requests",
      value: numberFormatter.format(totalRequests),
      helper: "All requests you have submitted",
      icon: ReceiptText,
      href: "/dashboard/tenant/requests",
    },
    {
      label: "Ready for payment",
      value: numberFormatter.format(approvedRequests),
      helper: "Approved by property owners",
      icon: BadgeCheck,
      href: "/dashboard/tenant/requests?status=APPROVED",
    },
    {
      label: "Active rentals",
      value: numberFormatter.format(activeRentals),
      helper: "Paid and currently active agreements",
      icon: Home,
      href: "/dashboard/tenant/requests",
    },
    {
      label: "Total paid",
      value: `৳${numberFormatter.format(totalPaid)}`,
      helper: `${numberFormatter.format(successfulPayments)} successful payment${successfulPayments === 1 ? "" : "s"}`,
      icon: CircleDollarSign,
      href: "/dashboard/tenant/payments",
    },
  ]

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Tenant workspace</Badge>
          <p className="mt-4 text-sm text-muted-foreground">
            Welcome back, {userName}.
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Your rental journey
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Track property requests, approved payments, and active rentals from
            one protected dashboard.
          </p>
        </div>
        <Button className="h-10" asChild>
          <Link href="/properties">
            <Search /> Browse properties
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
                  Your latest property request activity
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/tenant/requests">
                  View all <ArrowRight />
                </Link>
              </Button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <ReceiptText className="size-5" />
                </span>
                <h3 className="mt-4 font-semibold">No rental requests yet</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                  Browse available homes and submit your first rental request.
                </p>
                <Button className="mt-5" size="sm" asChild>
                  <Link href="/properties">
                    <Search /> Browse properties
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y">
                {recentRequests.map((request) => (
                  <div
                    key={request.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/properties/${request.property.id}`}
                        className="truncate text-sm font-medium hover:underline"
                      >
                        {request.property.title}
                      </Link>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="size-3" />
                          {request.property.location}
                        </span>
                        <span>
                          Move-in{" "}
                          {dateFormatter.format(
                            new Date(request.requestedMoveInDate)
                          )}
                        </span>
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
              Continue your RentNest journey
            </p>
            <div className="mt-5 grid gap-3">
              <Button
                variant="outline"
                className="h-11 justify-between"
                asChild
              >
                <Link href="/properties">
                  Find a property <Search />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 justify-between"
                asChild
              >
                <Link href="/dashboard/tenant/requests">
                  Track rental requests <ReceiptText />
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-11 justify-between"
                asChild
              >
                <Link href="/dashboard/tenant/payments">
                  View payment history <CircleDollarSign />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
