import "server-only"

import { cookies } from "next/headers"

import { ACCESS_TOKEN_COOKIE } from "@/lib/auth-cookies"
import { env } from "@/lib/env"
import { ApiError } from "@/services/api-client"
import type { ApiErrorResponse, ApiResponse } from "@/types/api"

export async function authenticatedApiFetch<T>(path: string) {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value

  if (!accessToken) {
    throw new ApiError("Please sign in to continue.", 401)
  }

  const response = await fetch(`${env.apiUrl}${path}`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as
    ApiResponse<T> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null
    throw new ApiError(
      errorPayload?.message ??
        errorPayload?.errorSources?.[0]?.message ??
        "The server could not complete the request.",
      response.status
    )
  }

  if (!payload || !("data" in payload)) {
    throw new ApiError("The server returned an invalid response.", 502)
  }

  return payload
}
