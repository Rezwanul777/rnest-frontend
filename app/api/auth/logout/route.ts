import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

export async function POST() {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (accessToken) {
    await fetch(`${env.apiUrl}/auth/logout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    }).catch(() => null)
  }

  cookieStore.delete(ACCESS_TOKEN_COOKIE)
  cookieStore.delete(USER_ROLE_COOKIE)

  return NextResponse.json({ success: true, message: "Signed out." })
}
