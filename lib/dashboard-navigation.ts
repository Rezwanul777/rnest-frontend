import type { UserRole } from "@/types/auth"

export type DashboardNavItem = {
  label: string
  href: string
  icon:
    | "overview"
    | "requests"
    | "payments"
    | "reviews"
    | "properties"
    | "add-property"
    | "tenants"
    | "users"
}

export const dashboardNavigationByRole: Record<UserRole, DashboardNavItem[]> = {
  TENANT: [
    {
      label: "Overview",
      href: "/dashboard/tenant",
      icon: "overview",
    },
    {
      label: "Rental requests",
      href: "/dashboard/tenant/requests",
      icon: "requests",
    },
    {
      label: "Payments",
      href: "/dashboard/tenant/payments",
      icon: "payments",
    },
    {
      label: "My reviews",
      href: "/dashboard/tenant/reviews",
      icon: "reviews",
    },
  ],
  LANDLORD: [
    {
      label: "Overview",
      href: "/dashboard/landlord",
      icon: "overview",
    },
    {
      label: "My properties",
      href: "/dashboard/landlord/properties",
      icon: "properties",
    },
    {
      label: "Add property",
      href: "/dashboard/landlord/properties/new",
      icon: "add-property",
    },
    {
      label: "Rental requests",
      href: "/dashboard/landlord/requests",
      icon: "requests",
    },
    {
      label: "Tenant history",
      href: "/dashboard/landlord/tenants",
      icon: "tenants",
    },
  ],
  ADMIN: [
    {
      label: "Overview",
      href: "/dashboard/admin",
      icon: "overview",
    },
    {
      label: "User management",
      href: "/dashboard/admin/users",
      icon: "users",
    },
    {
      label: "Properties",
      href: "/dashboard/admin/properties",
      icon: "properties",
    },
    {
      label: "Rental requests",
      href: "/dashboard/admin/requests",
      icon: "requests",
    },
    {
      label: "Payments",
      href: "/dashboard/admin/payments",
      icon: "payments",
    },
  ],
}

export function getDashboardNavItem(role: UserRole, href: string) {
  return dashboardNavigationByRole[role].find((item) => item.href === href)
}
