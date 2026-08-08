import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock,
  Plus,
  Receipt,
  TrendingUp,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/require-role"
import { getLandlordProperties } from "@/services/landlord-property.service"
import { getLandlordRentalRequests } from "@/services/landlord-rental-request.service"

export default async function LandlordDashboardPage() {
  const user = await requireRole("LANDLORD")

  const [propertiesResult, activeResult, requestsResult, pendingResult] =
    await Promise.all([
      getLandlordProperties({ limit: 1 }).catch(() => ({ meta: { total: 0 } })),
      getLandlordProperties({ limit: 1, isAvailable: "true" }).catch(() => ({
        meta: { total: 0 },
      })),
      getLandlordRentalRequests({ limit: 1 }).catch(() => ({
        meta: { total: 0 },
      })),
      getLandlordRentalRequests({ limit: 1, status: "PENDING" }).catch(() => ({
        meta: { total: 0 },
      })),
    ])

  const totalProperties = propertiesResult.meta?.total ?? 0
  const activeProperties = activeResult.meta?.total ?? 0
  const totalRequests = requestsResult.meta?.total ?? 0
  const pendingRequests = pendingResult.meta?.total ?? 0

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Landlord Workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {user.name} 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Manage your property listings, review incoming rental requests, and track performance.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/landlord/properties/new">
            <Plus className="mr-2 size-4" /> Add property listing
          </Link>
        </Button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Listings
            </CardTitle>
            <Building2 className="size-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProperties}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {activeProperties} currently available to rent
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Requests
            </CardTitle>
            <Clock className="size-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingRequests}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              {pendingRequests > 0
                ? "Requires your approval"
                : "All requests reviewed"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Incoming Requests
            </CardTitle>
            <Receipt className="size-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRequests}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Lifetime requests across listings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Properties
            </CardTitle>
            <CheckCircle2 className="size-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{activeProperties}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Occupied or open for viewing
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/90 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Building2 className="size-5" />
              </span>
              <div>
                <CardTitle className="text-lg">My Properties</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Create, edit, remove, or toggle availability for your property listings.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/dashboard/landlord/properties">
                Manage listings <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <TrendingUp className="size-5" />
              </span>
              <div>
                <CardTitle className="text-lg">Rental Requests</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Review tenant requests, approve qualified tenants, or reject requests.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/dashboard/landlord/requests">
                View rental requests <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
