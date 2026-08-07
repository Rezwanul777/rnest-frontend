import { RoleDashboard } from "@/components/dashboard/role-dashboard"
import { requireRole } from "@/lib/require-role"

const tenantModules = [
  {
    title: "Rental requests",
    description:
      "Track pending, approved, rejected, active, and completed requests.",
  },
  {
    title: "Payment history",
    description:
      "Review successful rental payments and continue approved checkouts.",
  },
  {
    title: "Property reviews",
    description: "Leave feedback when an active rental has been completed.",
  },
]

export default async function TenantDashboardPage() {
  const user = await requireRole("TENANT")

  return (
    <RoleDashboard
      label="Tenant workspace"
      title="Your rental journey, in one place."
      description="This protected area will connect your rental requests, payments, and eligible reviews to the RentNest API."
      userName={user.name}
      items={tenantModules}
    />
  )
}
