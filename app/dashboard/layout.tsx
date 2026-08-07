import type { ReactNode } from "react"

import { DashboardShell } from "@/components/dashboard/dashboard-shell"
import { requireRole } from "@/lib/require-role"

export default async function DashboardLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const user = await requireRole()

  return <DashboardShell user={user}>{children}</DashboardShell>
}
