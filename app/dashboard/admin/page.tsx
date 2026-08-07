import { RoleDashboard } from "@/components/dashboard/role-dashboard"
import { requireRole } from "@/lib/require-role"

const adminModules = [
  {
    title: "User management",
    description: "Search platform users and manage ban or unban actions.",
  },
  {
    title: "Property moderation",
    description:
      "Inspect available and unavailable property listings across RentNest.",
  },
  {
    title: "Rental oversight",
    description:
      "Review rental requests, payment activity, and platform health.",
  },
]

export default async function AdminDashboardPage() {
  const user = await requireRole("ADMIN")

  return (
    <RoleDashboard
      label="Admin workspace"
      title="Keep the marketplace healthy."
      description="This protected area will connect user management, content moderation, and platform activity to the RentNest API."
      userName={user.name}
      items={adminModules}
    />
  )
}
