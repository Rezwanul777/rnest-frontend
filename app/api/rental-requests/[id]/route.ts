import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

type RentalRequestRouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: Request,
  { params }: RentalRequestRouteContext
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Please sign in as a landlord to continue." },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)

  if (!body || (body.status !== "APPROVED" && body.status !== "REJECTED")) {
    return NextResponse.json(
      { success: false, message: "Choose Approve or Reject." },
      { status: 400 }
    )
  }

  const { id } = await params
  const backendResponse = await fetch(
    `${env.apiUrl}/rental-requests/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    }
  )

  const payload = await backendResponse.json().catch(() => null)

  if (backendResponse.status === 401) {
    cookieStore.delete(ACCESS_TOKEN_COOKIE)
    cookieStore.delete(USER_ROLE_COOKIE)
  }

  return NextResponse.json(
    payload ?? {
      success: false,
      message: "The rental request service is currently unavailable.",
    },
    { status: backendResponse.status }
  )
}
