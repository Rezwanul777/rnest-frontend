import Link from "next/link"
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Home,
  Receipt,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/require-role"
import { getTenantRentalRequests } from "@/services/tenant-rental-request.service"

export default async function TenantDashboardPage() {
  const user = await requireRole("TENANT")

  const [allResult, pendingResult, approvedResult] = await Promise.all([
    getTenantRentalRequests({ limit: 1 }).catch(() => ({ meta: { total: 0 } })),
    getTenantRentalRequests({ limit: 1, status: "PENDING" }).catch(() => ({
      meta: { total: 0 },
    })),
    getTenantRentalRequests({ limit: 1, status: "APPROVED" }).catch(() => ({
      meta: { total: 0 },
    })),
  ])

  const totalRequests = allResult.meta?.total ?? 0
  const pendingRequests = pendingResult.meta?.total ?? 0
  const approvedRequests = approvedResult.meta?.total ?? 0

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Tenant Workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Welcome back, {user.name} 👋
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Track your rental requests, proceed to secure payments, and leave reviews for completed stays.
          </p>
        </div>
        <Button asChild>
          <Link href="/properties">
            <Home className="mr-2 size-4" /> Browse Properties
          </Link>
        </Button>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
            <Receipt className="size-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRequests}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Submitted rental applications
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
              Awaiting landlord approval
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Approved Requests
            </CardTitle>
            <CheckCircle2 className="size-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{approvedRequests}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Ready for payment checkout
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/90 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
                <Receipt className="size-5" />
              </span>
              <div>
                <CardTitle className="text-lg">Rental Request History</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  View the status of your applications and continue to payment when approved.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/dashboard/tenant/requests">
                View rental requests <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/90 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500">
                <CreditCard className="size-5" />
              </span>
              <div>
                <CardTitle className="text-lg">Browse & Rent Properties</CardTitle>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Search through thousands of verified rental listings with advanced filters.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <Button variant="outline" className="w-full justify-between" asChild>
              <Link href="/properties">
                Explore listings <ArrowRight className="size-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
