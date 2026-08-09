import type { Metadata } from "next"

import { AdminUserManagement } from "@/components/dashboard/admin-user-management"
import { requireRole } from "@/lib/require-role"
import { getAdminUsers } from "@/services/admin-user.service"
import type { UserRole } from "@/types/auth"

export const metadata: Metadata = {
  title: "User management",
}

const userRoles = new Set<UserRole>(["TENANT", "LANDLORD", "ADMIN"])

type AdminUsersPageProps = {
  searchParams: Promise<{
    page?: string
    search?: string
    role?: string
    isActive?: string
  }>
}

function parsePage(value?: string) {
  const page = Number(value)
  return Number.isInteger(page) && page > 0 ? page : 1
}

function parseRole(value?: string) {
  return value && userRoles.has(value as UserRole)
    ? (value as UserRole)
    : undefined
}

function parseStatus(value?: string) {
  return value === "true" || value === "false" ? value : undefined
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const admin = await requireRole("ADMIN")
  const query = await searchParams
  const page = parsePage(query.page)
  const search = query.search?.trim().slice(0, 100) ?? ""
  const role = parseRole(query.role)
  const isActive = parseStatus(query.isActive)
  const { users, meta } = await getAdminUsers({
    page,
    search,
    role,
    isActive,
  })

  return (
    <AdminUserManagement
      initialUsers={users}
      meta={meta}
      currentAdminId={admin.id}
      activeSearch={search}
      activeRole={role}
      activeStatus={isActive}
    />
  )
}
