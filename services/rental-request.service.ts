import type { ApiErrorResponse, ApiResponse } from "@/types/api"
import type {
  RentalRequest,
  SubmitRentalRequestPayload,
  UpdateRentalRequestStatus,
} from "@/types/rental-request"

export type RentalRequestFieldError = {
  field?: string
  path?: string
  message: string
}

export class RentalRequestApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: RentalRequestFieldError[] = []
  ) {
    super(message)
    this.name = "RentalRequestApiError"
  }
}

export async function submitRentalRequest(payload: SubmitRentalRequestPayload) {
  const response = await fetch("/api/rental-requests", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const result = (await response.json().catch(() => null)) as
    ApiResponse<RentalRequest> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = result as ApiErrorResponse | null
    const fieldErrors = [
      ...(errorPayload?.errorDetails ?? []),
      ...(errorPayload?.errorSources ?? []),
    ]
      .filter((item) => Boolean(item.message))
      .map((item) => {
        const field = "field" in item ? item.field : undefined

        return {
          field: typeof field === "string" ? field : undefined,
          path: item.path,
          message: item.message as string,
        }
      })

    throw new RentalRequestApiError(
      errorPayload?.message ?? "Unable to submit the rental request.",
      response.status,
      fieldErrors
    )
  }

  if (!result || !("data" in result)) {
    throw new RentalRequestApiError(
      "The server returned an invalid response.",
      502
    )
  }

  return result
}

export async function updateRentalRequestStatus(
  requestId: string,
  status: UpdateRentalRequestStatus
) {
  const response = await fetch(`/api/rental-requests/${requestId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
    cache: "no-store",
  })

  const result = (await response.json().catch(() => null)) as
    { success: boolean; message: string } | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = result as ApiErrorResponse | null
    throw new RentalRequestApiError(
      errorPayload?.message ?? "Unable to update the rental request.",
      response.status
    )
  }

  if (!result || !("success" in result)) {
    throw new RentalRequestApiError(
      "The server returned an invalid response.",
      502
    )
  }

  return result
}
