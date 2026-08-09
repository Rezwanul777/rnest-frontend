import type { ApiErrorResponse, ApiResponse } from "@/types/api"
import type { AdminUser } from "@/types/admin"

export class AdminUserApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "AdminUserApiError"
  }
}

export async function updateAdminUserStatus(userId: string, isActive: boolean) {
  const response = await fetch(
    `/api/admin/users/${encodeURIComponent(userId)}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isActive }),
      cache: "no-store",
    }
  )

  const payload = (await response.json().catch(() => null)) as
    ApiResponse<AdminUser> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null
    throw new AdminUserApiError(
      errorPayload?.message ?? "Unable to update the user account.",
      response.status
    )
  }

  if (!payload || !("data" in payload)) {
    throw new AdminUserApiError("The server returned an invalid response.", 502)
  }

  return payload
}
