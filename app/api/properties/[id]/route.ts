import { cookies } from "next/headers"
import { NextResponse } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"

type PropertyRouteContext = {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: Request,
  { params }: PropertyRouteContext
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

  if (!body) {
    return NextResponse.json(
      { success: false, message: "Invalid property information." },
      { status: 400 }
    )
  }

  const { id } = await params
  const backendResponse = await fetch(
    `${env.apiUrl}/properties/${encodeURIComponent(id)}`,
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
      message: "The property service is currently unavailable.",
    },
    { status: backendResponse.status }
  )
}

export async function DELETE(
  _request: Request,
  { params }: PropertyRouteContext
) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    return NextResponse.json(
      { success: false, message: "Please sign in as a landlord to continue." },
      { status: 401 }
    )
  }

  const { id } = await params
  const backendResponse = await fetch(
    `${env.apiUrl}/properties/${encodeURIComponent(id)}`,
    {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
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
      message: "The property service is currently unavailable.",
    },
    { status: backendResponse.status }
  )
}
