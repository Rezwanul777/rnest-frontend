import { RoleDashboard } from "@/components/dashboard/role-dashboard"
import { requireRole } from "@/lib/require-role"

const landlordModules = [
  {
    title: "Property management",
    description:
      "Create, edit, remove, and control availability for your listings.",
  },
  {
    title: "Incoming requests",
    description:
      "Review tenant requests and approve or reject them with clear feedback.",
  },
  {
    title: "Rental activity",
    description:
      "Follow active rentals, tenant history, and confirmed earnings.",
  },
]

export default async function LandlordDashboardPage() {
  const user = await requireRole("LANDLORD")

  return (
    <RoleDashboard
      label="Landlord workspace"
      title="Manage your rental business."
      description="This protected area will connect your properties, incoming requests, and rental activity to the RentNest API."
      userName={user.name}
      items={landlordModules}
    />
  )
}
