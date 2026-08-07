import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import {
  ACCESS_TOKEN_COOKIE,
  authCookieOptions,
  USER_ROLE_COOKIE,
} from "@/lib/auth-cookies"
import { env } from "@/lib/env"
import type { ApiResponse } from "@/types/api"
import type { AuthUser } from "@/types/auth"

type BackendLoginData = {
  user: AuthUser
  accessToken: string
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json(
      { success: false, message: "Invalid login request." },
      { status: 400 }
    )
  }

  const backendResponse = await fetch(`${env.apiUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const payload = await backendResponse.json().catch(() => null)

  if (!backendResponse.ok) {
    return NextResponse.json(
      payload ?? { success: false, message: "Unable to sign in." },
      { status: backendResponse.status }
    )
  }

  const loginResponse = payload as ApiResponse<BackendLoginData>
  const { accessToken, user } = loginResponse.data ?? {}

  if (!accessToken || !user?.role) {
    return NextResponse.json(
      {
        success: false,
        message: "The authentication response was incomplete.",
      },
      { status: 502 }
    )
  }

  const cookieStore = await cookies()
  cookieStore.set(ACCESS_TOKEN_COOKIE, accessToken, authCookieOptions)
  cookieStore.set(USER_ROLE_COOKIE, user.role, authCookieOptions)

  return NextResponse.json({
    success: true,
    message: loginResponse.message,
    data: { user },
  })
}
