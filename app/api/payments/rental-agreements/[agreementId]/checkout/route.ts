import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

type CheckoutRouteContext = {
  params: Promise<{ agreementId: string }>
}

export async function POST(
  _request: Request,
  { params }: CheckoutRouteContext
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Please sign in as a tenant to continue." },
      { status: 401 }
    )
  }

  const { agreementId } = await params

  if (!agreementId.trim()) {
    return NextResponse.json(
      { success: false, message: "A rental agreement is required." },
      { status: 400 }
    )
  }

  let backendResponse: Response

  try {
    backendResponse = await fetch(
      `${env.apiUrl}/payments/rental-agreements/${encodeURIComponent(agreementId)}/checkout`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
      }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "The payment service is temporarily unavailable.",
      },
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
