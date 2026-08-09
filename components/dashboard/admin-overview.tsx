import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CircleDollarSign,
  Clock3,
  MapPin,
  ReceiptText,
  ShieldCheck,
  UserRoundPlus,
  UsersRound,
} from "lucide-react"

import { RentalRequestStatusBadge } from "@/components/dashboard/rental-request-status-badge"
import { UserRoleBadge } from "@/components/dashboard/user-role-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { AdminUser } from "@/types/admin"
import type { RentalRequest } from "@/types/rental-request"

const numberFormatter = new Intl.NumberFormat("en-BD")
const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

type AdminOverviewProps = {
  userName: string
  totalUsers: number
  totalProperties: number
  pendingRequests: number
  confirmedRevenue: number
  successfulPayments: number
  recentUsers: AdminUser[]
  recentRequests: RentalRequest[]
}

function formatDate(value?: string) {
  return value ? dateFormatter.format(new Date(value)) : "Date unavailable"
}

export function AdminOverview({
  userName,
  totalUsers,
  totalProperties,
  pendingRequests,
  confirmedRevenue,
  successfulPayments,
  recentUsers,
  recentRequests,
}: AdminOverviewProps) {
  const stats = [
    {
      label: "Total users",
      value: numberFormatter.format(totalUsers),
      helper: "Tenants, landlords, and admins",
      icon: UsersRound,
      href: "/dashboard/admin/users",
    },
    {
      label: "Total properties",
      value: numberFormatter.format(totalProperties),
      helper: "Available and unavailable listings",
      icon: Building2,
      href: "/dashboard/admin/properties",
    },
    {
      label: "Pending requests",
      value: numberFormatter.format(pendingRequests),
      helper: "Waiting for landlord decisions",
      icon: Clock3,
      href: "/dashboard/admin/requests?status=PENDING",
    },
    {
      label: "Confirmed revenue",
      value: `৳${numberFormatter.format(confirmedRevenue)}`,
      helper: `${numberFormatter.format(successfulPayments)} successful payment${successfulPayments === 1 ? "" : "s"}`,
      icon: CircleDollarSign,
      href: "/dashboard/admin/payments?status=PAID",
    },
  ]

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Admin workspace</Badge>
          <p className="mt-4 text-sm text-muted-foreground">
            Welcome back, {userName}.
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
            Platform health overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Monitor marketplace growth, listing activity, rental requests, and
            verified Stripe revenue from one protected dashboard.
          </p>
        </div>
        <Badge
          variant="outline"
          className="w-fit border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-emerald-700 dark:text-emerald-300"
        >
          <ShieldCheck /> Backend data live
        </Badge>
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

      <section className="grid gap-5 xl:grid-cols-2">
        <Card className="overflow-hidden bg-card/90">
          <CardContent className="px-0 py-0">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">Recent users</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Latest accounts created on RentNest
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/admin/users">
                  Manage users <ArrowRight />
                </Link>
              </Button>
            </div>

            {recentUsers.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <UserRoundPlus className="size-8 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">No users found</h3>
              </div>
            ) : (
              <div className="divide-y">
                {recentUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {user.name}
                      </p>
                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {user.email} · Joined {formatDate(user.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserRoleBadge role={user.role} />
                      <Badge
                        variant="outline"
                        className={
                          user.isActive
                            ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
                            : "border-red-400/25 bg-red-400/10 text-red-700 dark:text-red-300"
                        }
                      >
                        {user.isActive ? "Active" : "Banned"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-card/90">
          <CardContent className="px-0 py-0">
            <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
              <div>
                <h2 className="font-semibold">Latest rental activity</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Requests across every RentNest property
                </p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/admin/requests">
                  Inspect all <ArrowRight />
                </Link>
              </Button>
            </div>

            {recentRequests.length === 0 ? (
              <div className="flex flex-col items-center px-6 py-14 text-center">
                <ReceiptText className="size-8 text-muted-foreground" />
                <h3 className="mt-4 font-semibold">No rental requests found</h3>
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
                        <span>{formatDate(request.createdAt)}</span>
                      </p>
                    </div>
                    <RentalRequestStatusBadge status={request.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
