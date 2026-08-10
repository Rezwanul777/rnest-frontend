import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

type PaymentSessionRouteContext = {
  params: Promise<{ sessionId: string }>
}

export async function GET(
  _request: Request,
  { params }: PaymentSessionRouteContext
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Please sign in to check this payment." },
      { status: 401 }
    )
  }

  const { sessionId } = await params

  if (!sessionId.startsWith("cs_")) {
    return NextResponse.json(
      { success: false, message: "Invalid Stripe Checkout session." },
      { status: 400 }
    )
  }

  let backendResponse: Response

  try {
    backendResponse = await fetch(
      `${env.apiUrl}/payments/session/${encodeURIComponent(sessionId)}`,
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: "The payment service is unavailable." },
      { status: 502 }
    )
  }

  const payload = await backendResponse.json().catch(() => null)

  if (backendResponse.status === 401) {
    cookieStore.delete(ACCESS_TOKEN_COOKIE)
    cookieStore.delete(USER_ROLE_COOKIE)
  }

  return NextResponse.json(
    payload ?? {
      success: false,
      message: "The payment service returned an invalid response.",
    },
    { status: backendResponse.status }
  )
}
