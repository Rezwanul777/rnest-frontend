"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  CheckCircle,
  LoaderCircle,
  RotateCcw,
  Search,
  UserCheck,
  UserX,
  Users,
} from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { AdminUser } from "@/services/admin.service"
import type { PaginationMeta } from "@/types/api"

type AdminUserTableProps = {
  initialUsers: AdminUser[]
  meta: PaginationMeta
  activeSearch: string
  activeRole?: string
}

function createPageHref(page: number, search: string, role?: string) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (search) params.set("search", search)
  if (role) params.set("role", role)

  const query = params.toString()
  return query ? `/dashboard/admin?${query}` : "/dashboard/admin"
}

export function AdminUserTable({
  initialUsers,
  meta,
  activeSearch,
  activeRole,
}: AdminUserTableProps) {
  const router = useRouter()
  const [users, setUsers] = React.useState(initialUsers)
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  async function toggleBan(userId: string, currentBanned: boolean) {
    const nextBanned = !currentBanned
    const snapshot = users

    setPendingId(userId)
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isBanned: nextBanned } : user
      )
    )

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isBanned: nextBanned }),
      })

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update user status.")
      }

      toast.success(
        nextBanned ? "User account banned" : "User account unbanned",
        {
          description: data?.message || `User is now ${nextBanned ? "banned" : "active"}.`,
        }
      )
      router.refresh()
    } catch (error) {
      setUsers(snapshot)
      toast.error("Action failed", {
        description:
          error instanceof Error
            ? error.message
            : "Something went wrong while updating user status.",
      })
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card/90">
        <CardContent className="py-4">
          <form
            action="/dashboard/admin"
            method="get"
            className="grid gap-3 sm:grid-cols-[1fr_180px_auto]"
          >
            <label className="relative">
              <span className="sr-only">Search users</span>
              <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="search"
                defaultValue={activeSearch}
                placeholder="Search user name, email..."
                className="h-10 pl-9"
              />
            </label>
            <label>
              <span className="sr-only">Role filter</span>
              <select
                name="role"
                defaultValue={activeRole ?? ""}
                className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">All Roles</option>
                <option value="TENANT">Tenants</option>
                <option value="LANDLORD">Landlords</option>
                <option value="ADMIN">Admins</option>
              </select>
            </label>
            <div className="flex gap-2">
              <Button type="submit" className="h-10 flex-1">
                Filter
              </Button>
              {(activeSearch || activeRole) && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon-lg"
                  className="h-10 w-10"
                  asChild
                >
                  <Link href="/dashboard/admin" aria-label="Clear user filters">
                    <RotateCcw />
                  </Link>
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing {users.length} of {meta.total} users
        </span>
      </div>

      {users.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <Users className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No users found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No accounts match your current filter parameters.
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card/90">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isBanned = Boolean(user.isBanned)
                const isUpdating = pendingId === user.id

                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "ADMIN"
                            ? "default"
                            : user.role === "LANDLORD"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isBanned ? (
                        <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                          <Ban className="size-3" /> Banned
                        </Badge>
                      ) : (
                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                          <CheckCircle className="size-3" /> Active
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role === "ADMIN" ? (
                        <span className="text-xs text-muted-foreground">Protected Admin</span>
                      ) : (
                        <Button
                          size="sm"
                          variant={isBanned ? "outline" : "destructive"}
                          disabled={isUpdating}
                          onClick={() => toggleBan(user.id, isBanned)}
                        >
                          {isUpdating ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : isBanned ? (
                            <>
                              <UserCheck className="mr-1.5 size-3.5" /> Unban User
                            </>
                          ) : (
                            <>
                              <UserX className="mr-1.5 size-3.5" /> Ban User
                            </>
                          )}
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
          aria-label="User pagination"
        >
          <Button
            variant="outline"
            disabled={meta.page <= 1}
            asChild={meta.page > 1}
          >
            {meta.page > 1 ? (
              <Link href={createPageHref(meta.page - 1, activeSearch, activeRole)}>
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
              <Link href={createPageHref(meta.page + 1, activeSearch, activeRole)}>
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
