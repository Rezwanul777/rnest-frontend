"use client"

import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TenantPaymentError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Card className="mx-auto max-w-xl items-center bg-card/90 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </span>
      <h1 className="mt-5 text-xl font-semibold">
        Could not load payment details
      </h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        We could not verify this rental agreement. Please try again or return to
        your requests.
      </p>
      <div className="mt-5 flex flex-wrap justify-center gap-2">
        <Button onClick={reset}>Try again</Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard/tenant/requests">Rental requests</Link>
        </Button>
      </div>
    </Card>
  )
}
