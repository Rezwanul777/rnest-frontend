import { env } from "@/lib/env"
import { ApiErrorResponse, ApiResponse } from "@/types/api"


export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type ApiFetchOptions = RequestInit & {
  revalidate?: number
}

export async function apiFetch<T>(
  path: string,
  { revalidate = 60, ...options }: ApiFetchOptions = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(`${env.apiUrl}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
    next: {
      revalidate,
    },
  })

  const payload = (await response.json().catch(() => null)) as
    ApiResponse<T> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null
    const message =
      errorPayload?.message ??
      errorPayload?.errorSources?.[0]?.message ??
      "The server could not complete the request."

    throw new ApiError(message, response.status)
  }

  if (!payload || !("data" in payload)) {
    throw new ApiError("The server returned an invalid response.", 502)
  }

  return payload as ApiResponse<T>
}
