import { LandlordOverview } from "@/components/dashboard/landlord-overview"
import { requireRole } from "@/lib/require-role"
import { getLandlordOverview } from "@/services/landlord-overview.service"

export default async function LandlordDashboardPage() {
  const user = await requireRole("LANDLORD")
  const overview = await getLandlordOverview()

  return <LandlordOverview userName={user.name} {...overview} />
}
