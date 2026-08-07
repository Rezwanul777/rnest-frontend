import { NextResponse } from "next/server"

import { env } from "@/lib/env"

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)

  if (!body) {
    return NextResponse.json(
      { success: false, message: "Invalid registration request." },
      { status: 400 }
    )
  }

  const backendResponse = await fetch(`${env.apiUrl}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const payload = await backendResponse.json().catch(() => null)

  return NextResponse.json(
    payload ?? { success: false, message: "Unable to create the account." },
    { status: backendResponse.status }
  )
}
