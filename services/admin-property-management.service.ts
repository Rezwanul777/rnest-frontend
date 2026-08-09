import type { ApiErrorResponse, ApiResponse } from "@/types/api"

type AdminPropertyAvailabilityResult = {
  id: string
  isAvailable: boolean
}

export class AdminPropertyModerationApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "AdminPropertyModerationApiError"
  }
}

export async function setAdminPropertyAvailability(
  propertyId: string,
  isAvailable: boolean
) {
  const response = await fetch(
    `/api/admin/properties/${encodeURIComponent(propertyId)}/availability`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isAvailable }),
      cache: "no-store",
    }
  )

  const payload = (await response.json().catch(() => null)) as
    ApiResponse<AdminPropertyAvailabilityResult> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null
    throw new AdminPropertyModerationApiError(
      errorPayload?.message ?? "Unable to moderate this property.",
      response.status
    )
  }

  if (!payload || !("data" in payload)) {
    throw new AdminPropertyModerationApiError(
      "The property service returned an invalid response.",
      502
    )
  }

  return payload
}
