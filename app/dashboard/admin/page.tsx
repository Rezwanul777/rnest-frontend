import {
  Building2,
  Clock,
  Receipt,
  ShieldAlert,
  Users,
} from "lucide-react"

import { AdminContentModeration } from "@/components/dashboard/admin-content-moderation"
import { AdminUserTable } from "@/components/dashboard/admin-user-table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { requireRole } from "@/lib/require-role"
import {
  getAdminProperties,
  getAdminRequests,
  getAdminUsers,
} from "@/services/admin.service"

type AdminDashboardPageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
    tab?: string
  }>
}

function parsePage(value?: string) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

export default async function AdminDashboardPage({
  searchParams,
}: AdminDashboardPageProps) {
  const user = await requireRole("ADMIN")

  const query = await searchParams
  const page = parsePage(query.page)
  const search = query.search?.trim() ?? ""
  const role = query.role ?? ""

  const [usersData, propertiesData, requestsData] = await Promise.all([
    getAdminUsers({ page, limit: 10, search, role }).catch(() => ({
      users: [],
      meta: { page: 1, limit: 10, total: 0, totalPages: 1 },
    })),
    getAdminProperties({ limit: 50 }).catch(() => ({
      listings: [],
      meta: { page: 1, limit: 50, total: 0, totalPages: 1 },
    })),
    getAdminRequests({ limit: 50 }).catch(() => ({
      requests: [],
      meta: { page: 1, limit: 50, total: 0, totalPages: 1 },
    })),
  ])

  const totalUsers = usersData.meta?.total ?? usersData.users.length
  const totalProperties = propertiesData.meta?.total ?? propertiesData.listings.length
  const totalRequests = requestsData.meta?.total ?? requestsData.requests.length
  const pendingRequests = requestsData.requests.filter(
    (req) => req.status === "PENDING"
  ).length

  return (
    <div className="space-y-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline" className="border-amber-500/30 text-amber-500">
            Admin Workspace
          </Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Platform Overview & Moderation
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Welcome back, {user.name}. Manage platform users, inspect listings, and monitor marketplace activity.
          </p>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card/90 border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <Users className="size-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Tenants, Landlords & Admins
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Properties
            </CardTitle>
            <Building2 className="size-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalProperties}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Listings across all landlords
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests
            </CardTitle>
            <Receipt className="size-5 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalRequests}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Platform rental applications
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card/90">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending Moderation
            </CardTitle>
            <Clock className="size-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{pendingRequests}</div>
            <p className="mt-1 text-xs text-muted-foreground">
              Unresolved rental requests
            </p>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-6 pt-4 border-t">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Search registered platform accounts and manage ban/unban status.
          </p>
        </div>
        <AdminUserTable
          initialUsers={usersData.users}
          meta={usersData.meta}
          activeSearch={search}
          activeRole={role}
        />
      </section>

      <section className="space-y-6 pt-8 border-t">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Moderation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Inspect active listings and global rental requests across RentNest.
          </p>
        </div>
        <AdminContentModeration
          properties={propertiesData.listings}
          requests={requestsData.requests}
        />
      </section>
    </div>
  )
}
