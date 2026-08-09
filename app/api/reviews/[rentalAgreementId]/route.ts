import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

type ReviewRouteContext = {
  params: Promise<{ rentalAgreementId: string }>
}

export async function POST(request: Request, { params }: ReviewRouteContext) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Please sign in as a tenant to continue." },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json(
      { success: false, message: "Enter a valid review." },
      { status: 400 }
    )
  }

  const { rentalAgreementId } = await params

  let backendResponse: Response

  try {
    backendResponse = await fetch(
      `${env.apiUrl}/reviews/${encodeURIComponent(rentalAgreementId)}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        cache: "no-store",
      }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: "The review service is unavailable." },
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
      message: "The review service returned an invalid response.",
    },
    { status: backendResponse.status }
  )
}
