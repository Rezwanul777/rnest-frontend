import type { UserRole } from "@/types/auth"

export const dashboardPathByRole: Record<UserRole, string> = {
  TENANT: "/dashboard/tenant",
  LANDLORD: "/dashboard/landlord",
  ADMIN: "/dashboard/admin",
}

export function isUserRole(value: string | undefined): value is UserRole {
  return value === "TENANT" || value === "LANDLORD" || value === "ADMIN"
}

export function getDashboardPath(role: UserRole) {
  return dashboardPathByRole[role]
}
