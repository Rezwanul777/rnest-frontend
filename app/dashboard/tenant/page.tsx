import { TenantOverview } from "@/components/dashboard/tenant-overview"
import { requireRole } from "@/lib/require-role"
import { getTenantOverview } from "@/services/tenant-overview.service"

export default async function TenantDashboardPage() {
  const user = await requireRole("TENANT")
  const overview = await getTenantOverview()

  return <TenantOverview userName={user.name} {...overview} />
}
