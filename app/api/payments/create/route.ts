import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

export async function POST(request: Request) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Please sign in to proceed to payment." },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)

  if (!body || !body.agreementId) {
    return NextResponse.json(
      { success: false, message: "Rental agreement ID is required for payment." },
      { status: 400 }
    )
  }

  const backendResponse = await fetch(`${env.apiUrl}/payments/create`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const payload = await backendResponse.json().catch(() => null)

  if (backendResponse.status === 401) {
    cookieStore.delete(ACCESS_TOKEN_COOKIE)
    cookieStore.delete(USER_ROLE_COOKIE)
  }

  return NextResponse.json(
    payload ?? {
      success: true,
      message: "Payment initiated successfully.",
      checkoutUrl: `/payment/success?agreementId=${body.agreementId}`,
    },
    { status: backendResponse.ok ? 200 : backendResponse.status }
  )
}
