import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

type RentalAgreementRouteContext = {
  params: Promise<{ agreementId: string }>
}

export async function PATCH(
  request: Request,
  { params }: RentalAgreementRouteContext
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Please sign in as a tenant to continue." },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)

  if (!body || body.status !== "COMPLETED") {
    return NextResponse.json(
      {
        success: false,
        message: "Only an active rental can be marked as completed here.",
      },
      { status: 400 }
    )
  }

  const { agreementId } = await params

  let backendResponse: Response

  try {
    backendResponse = await fetch(
      `${env.apiUrl}/rental-agreements/${encodeURIComponent(agreementId)}/update`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "COMPLETED" }),
        cache: "no-store",
      }
    )
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "The rental agreement service is currently unavailable.",
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
      message: "The rental agreement service returned an invalid response.",
    },
    { status: backendResponse.status }
  )
}
