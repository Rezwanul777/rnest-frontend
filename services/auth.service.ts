import type { ApiErrorResponse, ApiResponse } from "@/types/api"
import type {
  AuthUser,
  FieldError,
  LoginPayload,
  RegisterPayload,
} from "@/types/auth"

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: FieldError[] = []
  ) {
    super(message)
    this.name = "AuthApiError"
  }
}

async function authRequest<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as
    ApiResponse<T> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null
    const fieldErrors = (errorPayload?.errorDetails ?? [])
      .filter((item) => Boolean(item.message))
      .map((item) => ({
        field: item.field,
        path: item.path,
        message: item.message as string,
      }))

    throw new AuthApiError(
      errorPayload?.message ?? "Authentication request failed.",
      response.status,
      fieldErrors
    )
  }

  if (!payload || !("data" in payload)) {
    throw new AuthApiError("The server returned an invalid response.", 502)
  }

  return payload.data
}

export function login(payload: LoginPayload) {
  return authRequest<{ user: AuthUser }>("/api/auth/login", payload)
}

export function register(payload: RegisterPayload) {
  return authRequest<AuthUser>("/api/auth/register", payload)
}
