"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  LoaderCircle,
  RotateCcw,
  Search,
  ShieldCheck,
  UserCheck,
  UsersRound,
} from "lucide-react"
import { toast } from "sonner"

import { UserRoleBadge } from "@/components/dashboard/user-role-badge"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AdminUserApiError,
  updateAdminUserStatus,
} from "@/services/admin-user-management.service"
import type { AdminUser } from "@/types/admin"
import type { PaginationMeta } from "@/types/api"
import type { UserRole } from "@/types/auth"

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

type AdminUserManagementProps = {
  initialUsers: AdminUser[]
  meta: PaginationMeta
  currentAdminId: string
  activeSearch: string
  activeRole?: UserRole
  activeStatus?: "true" | "false"
}

type UserListQuery = {
  search: string
  role?: UserRole
  isActive?: "true" | "false"
}

function createPageHref(page: number, query: UserListQuery) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (query.search) params.set("search", query.search)
  if (query.role) params.set("role", query.role)
  if (query.isActive) params.set("isActive", query.isActive)

  const searchParams = params.toString()
  return searchParams
    ? `/dashboard/admin/users?${searchParams}`
    : "/dashboard/admin/users"
}

export function AdminUserManagement({
  initialUsers,
  meta,
  currentAdminId,
  activeSearch,
  activeRole,
  activeStatus,
}: AdminUserManagementProps) {
  const router = useRouter()
  const [users, setUsers] = React.useState(initialUsers)
  const [selectedUser, setSelectedUser] = React.useState<AdminUser | null>(null)
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  const hasFilters = Boolean(activeSearch || activeRole || activeStatus)
  const pageQuery: UserListQuery = {
    search: activeSearch,
    role: activeRole,
    isActive: activeStatus,
  }

  async function confirmStatusChange() {
    if (!selectedUser || selectedUser.id === currentAdminId) return

    const target = selectedUser
    const nextIsActive = !target.isActive
    const snapshot = users

    setPendingId(target.id)
    setUsers((current) =>
      activeStatus
        ? current.filter((user) => user.id !== target.id)
        : current.map((user) =>
            user.id === target.id ? { ...user, isActive: nextIsActive } : user
          )
    )

    try {
      const result = await updateAdminUserStatus(target.id, nextIsActive)
      toast.success(nextIsActive ? "User unbanned" : "User banned", {
        description: result.message,
      })
      setSelectedUser(null)
      router.refresh()
    } catch (error) {
      setUsers(snapshot)
      toast.error("User status update failed", {
        description:
          error instanceof AdminUserApiError
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
            User management
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Search platform accounts, filter by role or status, and manage user
            access without exposing authentication credentials.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {meta.total} {meta.total === 1 ? "user" : "users"}
        </Badge>
      </section>

      <Card className="bg-card/90">
        <CardContent className="py-4">
          <form
            action="/dashboard/admin/users"
            method="get"
            className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_180px_180px_auto]"
          >
            <label className="relative">
              <span className="sr-only">Search users</span>
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                defaultValue={activeSearch}
                placeholder="Search name or email..."
                className="h-10 pl-9"
              />
            </label>
            <label>
              <span className="sr-only">User role</span>
              <select
                name="role"
                defaultValue={activeRole ?? ""}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All roles</option>
                <option value="TENANT">Tenant</option>
                <option value="LANDLORD">Landlord</option>
                <option value="ADMIN">Admin</option>
              </select>
            </label>
            <label>
              <span className="sr-only">Account status</span>
              <select
                name="isActive"
                defaultValue={activeStatus ?? ""}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All statuses</option>
                <option value="true">Active</option>
                <option value="false">Banned</option>
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
                    href="/dashboard/admin/users"
                    aria-label="Clear user filters"
                  >
                    <RotateCcw />
                  </Link>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {users.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <UsersRound className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No users found</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {hasFilters
              ? "No accounts match your current search and filters."
              : "No RentNest user accounts are available."}
          </p>
          {hasFilters && (
            <Button className="mt-5" variant="outline" asChild>
              <Link href="/dashboard/admin/users">
                <RotateCcw /> Clear filters
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card/90">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isCurrentAdmin = user.id === currentAdminId
                const isUpdating = pendingId === user.id

                return (
                  <TableRow
                    key={user.id}
                    className={isUpdating ? "opacity-60" : undefined}
                  >
                    <TableCell className="min-w-64">
                      <p className="font-medium">{user.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                        ID: {user.id.slice(0, 8)}…
                      </p>
                    </TableCell>
                    <TableCell>
                      <UserRoleBadge role={user.role} />
                    </TableCell>
                    <TableCell className="min-w-36 text-sm text-muted-foreground">
                      {dateFormatter.format(new Date(user.createdAt))}
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell className="text-right">
                      {isCurrentAdmin ? (
                        <Badge variant="outline">
                          <ShieldCheck /> Current admin
                        </Badge>
                      ) : (
                        <Button
                          type="button"
                          size="sm"
                          variant={user.isActive ? "destructive" : "outline"}
                          disabled={pendingId !== null}
                          onClick={() => setSelectedUser(user)}
                        >
                          {isUpdating ? (
                            <LoaderCircle className="animate-spin" />
                          ) : user.isActive ? (
                            <Ban />
                          ) : (
                            <UserCheck />
                          )}
                          {user.isActive ? "Ban" : "Unban"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {meta.totalPages > 1 && (
        <nav
          className="flex items-center justify-between border-t pt-5"
          aria-label="User management pagination"
        >
          <Button
            variant="outline"
            disabled={meta.page <= 1}
            asChild={meta.page > 1}
          >
            {meta.page > 1 ? (
              <Link href={createPageHref(meta.page - 1, pageQuery)}>
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
              <Link href={createPageHref(meta.page + 1, pageQuery)}>
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
        open={Boolean(selectedUser)}
        onOpenChange={(open) => {
          if (!open && pendingId === null) setSelectedUser(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedUser?.isActive
                ? "Ban user account?"
                : "Unban user account?"}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.isActive
                ? `${selectedUser.name} will no longer be able to use authenticated RentNest features.`
                : `${selectedUser?.name} will regain access to their RentNest account.`}
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
              variant={selectedUser?.isActive ? "destructive" : "default"}
              disabled={pendingId !== null}
              onClick={confirmStatusChange}
            >
              {pendingId ? (
                <LoaderCircle className="animate-spin" />
              ) : selectedUser?.isActive ? (
                <Ban />
              ) : (
                <UserCheck />
              )}
              {selectedUser?.isActive ? "Confirm ban" : "Confirm unban"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
