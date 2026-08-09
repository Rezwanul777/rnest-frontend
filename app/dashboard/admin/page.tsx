import type { Metadata } from "next"

import { AdminOverview } from "@/components/dashboard/admin-overview"
import { requireRole } from "@/lib/require-role"
import { getAdminOverview } from "@/services/admin-overview.service"

export const metadata: Metadata = {
  title: "Admin dashboard",
}

export default async function AdminDashboardPage() {
  const user = await requireRole("ADMIN")
  const overview = await getAdminOverview()

  return <AdminOverview userName={user.name} {...overview} />
}
