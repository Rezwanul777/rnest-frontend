"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  CheckCircle2,
  Clock3,
  ListChecks,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Star,
  TriangleAlert,
} from "lucide-react"

import { ReviewFormDialog } from "@/components/dashboard/review-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { ApiErrorResponse, ApiResponse } from "@/types/api"
import type { Payment } from "@/types/payment"

type ConfirmationState =
  "checking" | "pending" | "confirmed" | "failed" | "error"

type PaymentSuccessCardProps = {
  sessionId?: string
}

class PaymentConfirmationError extends Error {}

async function fetchPaymentSession(sessionId: string) {
  const response = await fetch(
    `/api/payments/session/${encodeURIComponent(sessionId)}`,
    {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    }
  )

  const result = (await response.json().catch(() => null)) as
    ApiResponse<Payment> | ApiErrorResponse | null

  if (!response.ok || !result || !("data" in result)) {
    const errorResult = result as ApiErrorResponse | null
    throw new PaymentConfirmationError(
      errorResult?.message ?? "Unable to confirm this payment."
    )
  }

  return result.data
}

function getConfirmationState(payment: Payment): ConfirmationState {
  if (
    payment.status === "PAID" &&
    (payment.rentalAgreement?.status === "ACTIVE" ||
      payment.rentalAgreement?.status === "COMPLETED")
  ) {
    return "confirmed"
  }

  if (
    payment.status === "FAILED" ||
    payment.status === "CANCELLED" ||
    payment.status === "REFUNDED"
  ) {
    return "failed"
  }

  return "pending"
}

export function PaymentSuccessCard({ sessionId }: PaymentSuccessCardProps) {
  const [state, setState] = useState<ConfirmationState>(
    sessionId ? "checking" : "error"
  )
  const [payment, setPayment] = useState<Payment | null>(null)
  const [message, setMessage] = useState(
    sessionId
      ? "Confirming your payment with the backend..."
      : "Missing session reference."
  )
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [reviewSubmitted, setReviewSubmitted] = useState(false)

  useEffect(() => {
    if (!sessionId) return
    const checkoutSessionId = sessionId

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout> | undefined
    let attempt = 0

    async function poll() {
      try {
        const nextPayment = await fetchPaymentSession(checkoutSessionId)
        if (cancelled) return

        const nextState = getConfirmationState(nextPayment)
        setPayment(nextPayment)
        setState(nextState)
        setReviewSubmitted(Boolean(nextPayment.rentalAgreement?.review))

        if (nextState === "confirmed") {
          setMessage("Stripe payment confirmed. Your rental is now active.")
          return
        }

        if (nextState === "failed") {
          setMessage("Stripe could not complete this payment.")
          return
        }

        attempt += 1
        setMessage(
          "Payment submitted. Waiting for secure webhook confirmation..."
        )

        if (attempt < 10) {
          timeoutId = setTimeout(poll, 1500)
        }
      } catch (error) {
        if (cancelled) return
        setState("error")
        setMessage(
          error instanceof PaymentConfirmationError
            ? error.message
            : "Unable to confirm this payment right now."
        )
      }
    }

    void poll()

    return () => {
      cancelled = true
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [sessionId])

  async function refreshStatus() {
    if (!sessionId || isRefreshing) return

    setIsRefreshing(true)

    try {
      const nextPayment = await fetchPaymentSession(sessionId)
      const nextState = getConfirmationState(nextPayment)
      setPayment(nextPayment)
      setState(nextState)
      setReviewSubmitted(Boolean(nextPayment.rentalAgreement?.review))
      setMessage(
        nextState === "confirmed"
          ? "Stripe payment confirmed. Your rental is now active."
          : nextState === "failed"
            ? "Stripe could not complete this payment."
            : "Payment submitted. Waiting for secure webhook confirmation..."
      )
    } catch (error) {
      setState("error")
      setMessage(
        error instanceof PaymentConfirmationError
          ? error.message
          : "Unable to confirm this payment right now."
      )
    } finally {
      setIsRefreshing(false)
    }
  }

  const agreement = payment?.rentalAgreement
  const isConfirmed = state === "confirmed" && Boolean(agreement)

  return (
    <Card className="w-full max-w-2xl bg-card/95 p-7 shadow-xl sm:p-10">
      <span
        className={
          isConfirmed
            ? "flex size-16 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
            : "flex size-16 items-center justify-center rounded-2xl border bg-muted text-muted-foreground"
        }
      >
        {state === "checking" || state === "pending" ? (
          <LoaderCircle className="size-8 animate-spin" />
        ) : isConfirmed ? (
          <CheckCircle2 className="size-8" />
        ) : (
          <TriangleAlert className="size-8" />
        )}
      </span>

      <Badge
        variant="outline"
        className={
          isConfirmed
            ? "mt-6 border-emerald-400/25 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
            : "mt-6"
        }
      >
        {isConfirmed ? "Payment confirmed" : "Stripe checkout returned"}
      </Badge>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        {isConfirmed
          ? "Your payment was successful"
          : "Your payment was submitted"}
      </h1>
      <p className="mt-3 max-w-xl leading-7 text-muted-foreground">{message}</p>

      <div className="mt-7 rounded-xl border bg-muted/35 p-5">
        <div className="flex gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium">Verified by the RentNest backend</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              The success URL alone is never accepted as proof of payment. The
              review action unlocks only after Stripe webhook confirmation.
            </p>
            {sessionId && (
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                Session reference: ••••{sessionId.slice(-8)}
              </p>
            )}
          </div>
        </div>
      </div>

      {isConfirmed && agreement ? (
        <div className="mt-4 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-5">
          <div className="flex gap-3">
            <ListChecks className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <div className="min-w-0 flex-1">
              <p className="font-medium">Leave a review</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Payment is confirmed for {agreement.property.title}. Share your
                experience now, as required by the RentNest tenant journey.
              </p>
              <div className="mt-4">
                {reviewSubmitted ? (
                  <Button variant="outline" asChild>
                    <Link href="/dashboard/tenant/reviews">
                      <Star /> Review submitted
                    </Link>
                  </Button>
                ) : (
                  <ReviewFormDialog
                    rentalAgreementId={agreement.id}
                    propertyTitle={agreement.property.title}
                    onSubmitted={() => setReviewSubmitted(true)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border p-5">
          <div className="flex gap-3">
            <Clock3 className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
            <div>
              <p className="font-medium">Review unlocks after confirmation</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                This normally takes only a moment. You can check the secure
                payment status again without creating another payment.
              </p>
              {sessionId && (
                <Button
                  type="button"
                  className="mt-4"
                  variant="outline"
                  disabled={isRefreshing}
                  onClick={refreshStatus}
                >
                  <RefreshCw className={isRefreshing ? "animate-spin" : ""} />
                  {isRefreshing ? "Checking..." : "Check payment status"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/tenant">
            <ReceiptText /> View tenant dashboard
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/dashboard/tenant/reviews">My reviews</Link>
        </Button>
      </div>
    </Card>
  )
}
