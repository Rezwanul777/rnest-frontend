"use client"

import { useState } from "react"
import { CreditCard, LoaderCircle } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { createCheckoutSession } from "@/services/payment-checkout.service"

type StripeCheckoutButtonProps = {
  agreementId: string
}

export function StripeCheckoutButton({
  agreementId,
}: StripeCheckoutButtonProps) {
  const [isPending, setIsPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleCheckout() {
    setIsPending(true)
    setErrorMessage(null)

    try {
      const checkoutUrl = await createCheckoutSession(agreementId)
      window.location.assign(checkoutUrl)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Stripe Checkout could not be started."

      setErrorMessage(message)
      toast.error(message)
      setIsPending(false)
    }
  }

  return (
    <div className="space-y-3">
      <Button
        type="button"
        size="lg"
        className="w-full sm:w-auto"
        disabled={isPending}
        onClick={handleCheckout}
      >
        {isPending ? <LoaderCircle className="animate-spin" /> : <CreditCard />}
        {isPending ? "Opening secure checkout..." : "Proceed to Stripe"}
      </Button>
      {errorMessage && (
        <p className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  )
}
