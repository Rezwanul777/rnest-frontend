import { cache } from "react"
import { cookies } from "next/headers"

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"
import type { ApiResponse } from "@/types/api"
import type { AuthUser } from "@/types/auth"

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) return null

  const response = await fetch(`${env.apiUrl}/auth/me`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  })

  if (response.status === 401 || response.status === 403) return null

  if (!response.ok) {
    throw new Error("Unable to verify the current session.")
  }

  const payload = (await response.json()) as ApiResponse<AuthUser>
  return payload.data ?? null
})

/**
 * Public pages must stay available if the session API is temporarily
 * unreachable. Protected dashboard routes continue to use getCurrentUser()
 * through requireRole(), where verification failures belong in the route's
 * error boundary.
 */
export async function getOptionalCurrentUser(): Promise<AuthUser | null> {
  try {
    return await getCurrentUser()
  } catch {
    return null
  }
}
