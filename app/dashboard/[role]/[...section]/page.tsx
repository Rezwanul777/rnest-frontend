import { notFound } from "next/navigation"

import { ModulePlaceholder } from "@/components/dashboard/module-placeholder"
import { getDashboardNavItem } from "@/lib/dashboard-navigation"
import { requireRole } from "@/lib/require-role"
import { getDashboardPath } from "@/lib/roles"
import type { UserRole } from "@/types/auth"

const roleBySegment: Record<string, UserRole> = {
  tenant: "TENANT",
  landlord: "LANDLORD",
  admin: "ADMIN",
}

type DashboardModulePageProps = {
  params: Promise<{
    role: string
    section: string[]
  }>
}

export default async function DashboardModulePage({
  params,
}: DashboardModulePageProps) {
  const { role: roleSegment, section } = await params
  const role = roleBySegment[roleSegment]

  if (!role) notFound()

  await requireRole(role)

  const href = `/dashboard/${roleSegment}/${section.join("/")}`
  const item = getDashboardNavItem(role, href)

  if (!item) notFound()

  return (
    <ModulePlaceholder
      title={item.label}
      dashboardHref={getDashboardPath(role)}
    />
  )
}
