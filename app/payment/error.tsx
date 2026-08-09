"use client"

import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PaymentOutcomeError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Card className="w-full max-w-xl items-center bg-card/95 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <h1 className="mt-5 text-xl font-semibold">
        Could not display the payment result
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Your Stripe payment is not changed by this display error. Check your
        tenant dashboard for its latest status.
      </p>
      <Button className="mt-5" onClick={reset}>
        Try again
      </Button>
    </Card>
  )
}
