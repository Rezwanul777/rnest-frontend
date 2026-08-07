import "server-only"

import { redirect } from "next/navigation"

import { getDashboardPath } from "@/lib/roles"
import { getCurrentUser } from "@/services/session.service"
import type { UserRole } from "@/types/auth"

export async function requireRole(expectedRole?: UserRole) {
  const user = await getCurrentUser()

  if (!user) redirect("/auth/login")

  if (expectedRole && user.role !== expectedRole) {
    redirect(getDashboardPath(user.role))
  }

  return user
}
