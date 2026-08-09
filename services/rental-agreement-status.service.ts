import type { ApiErrorResponse, ApiResponse } from "@/types/api"
import type { RentalAgreementStatus } from "@/types/rental-request"

type UpdatedRentalAgreementStatus = {
  status: RentalAgreementStatus
}

export class RentalAgreementStatusApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "RentalAgreementStatusApiError"
  }
}

export async function completeRentalAgreement(rentalAgreementId: string) {
  const response = await fetch(
    `/api/rental-agreements/${encodeURIComponent(rentalAgreementId)}`,
    {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: "COMPLETED" }),
      cache: "no-store",
    }
  )

  const result = (await response.json().catch(() => null)) as
    ApiResponse<UpdatedRentalAgreementStatus> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = result as ApiErrorResponse | null
    throw new RentalAgreementStatusApiError(
      errorPayload?.message ?? "Unable to complete this rental.",
      response.status
    )
  }

  if (!result || !("data" in result)) {
    throw new RentalAgreementStatusApiError(
      "The server returned an invalid response.",
      502
    )
  }

  return result.data
}
