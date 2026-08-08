import type { ApiErrorResponse } from "@/types/api"

export class PaymentApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message)
    this.name = "PaymentApiError"
  }
}

export type CreatePaymentPayload = {
  agreementId: string
  paymentGateway?: "STRIPE" | "SSLCOMMERZ"
}

export type PaymentResponse = {
  success: boolean
  message: string
  checkoutUrl?: string
  paymentId?: string
}

export async function createPaymentSession(
  payload: CreatePaymentPayload
): Promise<PaymentResponse> {
  const response = await fetch("/api/payments/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const data = (await response.json().catch(() => null)) as
    | PaymentResponse
    | ApiErrorResponse
    | null

  if (!response.ok) {
    const errorPayload = data as ApiErrorResponse | null
    throw new PaymentApiError(
      errorPayload?.message ?? "Unable to initiate payment session.",
      response.status
    )
  }

  return data as PaymentResponse
}
