import type { ApiErrorResponse } from "@/types/api"

export class ReviewApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "ReviewApiError"
  }
}

export type SubmitReviewPayload = {
  propertyId: string
  rating: number
  comment: string
}

export async function submitPropertyReview(payload: SubmitReviewPayload) {
  const response = await fetch("/api/reviews", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const data = (await response.json().catch(() => null)) as
    | { success: boolean; message: string }
    | ApiErrorResponse
    | null

  if (!response.ok) {
    const errorPayload = data as ApiErrorResponse | null
    throw new ReviewApiError(
      errorPayload?.message ?? "Unable to submit property review.",
      response.status
    )
  }

  return data
}
