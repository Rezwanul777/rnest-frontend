import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

type AdminPropertyAvailabilityRouteContext = {
  params: Promise<{ propertyId: string }>
}

export async function PATCH(
  request: Request,
  { params }: AdminPropertyAvailabilityRouteContext
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Please sign in as an admin to continue." },
      { status: 401 }
    )
  }

  const body = await request.json().catch(() => null)

  if (!body || typeof body.isAvailable !== "boolean") {
    return NextResponse.json(
      {
        success: false,
        message: "Property availability must be true or false.",
      },
      { status: 400 }
    )
  }

  const { propertyId } = await params
  let backendResponse: Response

  try {
    backendResponse = await fetch(
      `${env.apiUrl}/admin/properties/${encodeURIComponent(propertyId)}/availability`,
      {
        method: "PATCH",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isAvailable: body.isAvailable }),
        cache: "no-store",
      }
    )
  } catch {
    return NextResponse.json(
      { success: false, message: "The property service is unavailable." },
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
      message: "The property service returned an invalid response.",
    },
    { status: backendResponse.status }
  )
}
