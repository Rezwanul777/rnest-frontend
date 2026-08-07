import { redirect } from "next/navigation"

import { getDashboardPath } from "@/lib/roles"
import { requireRole } from "@/lib/require-role"

export default async function DashboardPage() {
  const user = await requireRole()
  redirect(getDashboardPath(user.role))
}
