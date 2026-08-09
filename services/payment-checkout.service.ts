import type { ApiErrorResponse, ApiResponse } from "@/types/api"

type CheckoutSessionData = {
  checkoutUrl: string | null
}

export class PaymentCheckoutApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = "PaymentCheckoutApiError"
    this.status = status
  }
}

function getErrorMessage(payload: ApiErrorResponse | null) {
  return (
    payload?.message ??
    payload?.errorSources?.[0]?.message ??
    payload?.errorDetails?.[0]?.message ??
    "Stripe Checkout could not be started. Please try again."
  )
}

export async function createCheckoutSession(agreementId: string) {
  const response = await fetch(
    `/api/payments/rental-agreements/${encodeURIComponent(agreementId)}/checkout`,
    {
      method: "POST",
      headers: { Accept: "application/json" },
    }
  )

  const payload = (await response.json().catch(() => null)) as
    ApiResponse<CheckoutSessionData> | ApiErrorResponse | null

  if (!response.ok) {
    throw new PaymentCheckoutApiError(
      getErrorMessage(payload as ApiErrorResponse | null),
      response.status
    )
  }

  if (!payload || !("data" in payload) || !payload.data.checkoutUrl) {
    throw new PaymentCheckoutApiError(
      "The payment server did not return a checkout link.",
      502
    )
  }

  let checkoutUrl: URL

  try {
    checkoutUrl = new URL(payload.data.checkoutUrl)
  } catch {
    throw new PaymentCheckoutApiError(
      "The payment server returned an invalid checkout link.",
      502
    )
  }

  if (checkoutUrl.protocol !== "https:") {
    throw new PaymentCheckoutApiError(
      "The payment server returned an insecure checkout link.",
      502
    )
  }

  return checkoutUrl.toString()
}
