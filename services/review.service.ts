import type { ApiErrorResponse, ApiResponse } from "@/types/api"
import type { CreatedReview, CreateReviewPayload } from "@/types/review"

export type ReviewFieldError = {
  field?: string
  path?: string
  message: string
}

export class ReviewApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: ReviewFieldError[] = []
  ) {
    super(message)
    this.name = "ReviewApiError"
  }
}

function getFieldErrors(payload: ApiErrorResponse | null) {
  return [...(payload?.errorDetails ?? []), ...(payload?.errorSources ?? [])]
    .filter((item) => Boolean(item.message))
    .map((item) => ({
      field:
        "field" in item && typeof item.field === "string"
          ? item.field
          : undefined,
      path: item.path,
      message: item.message as string,
    }))
}

export async function submitReview(
  rentalAgreementId: string,
  payload: CreateReviewPayload
) {
  const response = await fetch(
    `/api/reviews/${encodeURIComponent(rentalAgreementId)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      cache: "no-store",
    }
  )

  const result = (await response.json().catch(() => null)) as
    ApiResponse<CreatedReview> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = result as ApiErrorResponse | null
    throw new ReviewApiError(
      errorPayload?.message ?? "Unable to submit the review.",
      response.status,
      getFieldErrors(errorPayload)
    )
  }

  if (!result || !("data" in result)) {
    throw new ReviewApiError("The server returned an invalid response.", 502)
  }

  return result.data
}
