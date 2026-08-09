import type { Metadata } from "next"
import Link from "next/link"
import { CheckCircle2, Clock3, ListChecks, ReceiptText } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Payment submitted",
}

type PaymentSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { session_id: sessionId } = await searchParams

  return (
    <Card className="w-full max-w-2xl bg-card/95 p-7 shadow-xl sm:p-10">
      <span className="flex size-16 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400">
        <CheckCircle2 className="size-8" />
      </span>
      <Badge
        variant="outline"
        className="mt-6 border-emerald-400/25 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300"
      >
        Stripe checkout returned successfully
      </Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        Your payment was submitted
      </h1>
      <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
        Stripe has returned you to RentNest. The secure webhook now confirms the
        charge and activates your rental agreement in the backend.
      </p>

      <div className="mt-7 rounded-xl border bg-muted/35 p-5">
        <div className="flex gap-3">
          <Clock3 className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="font-medium">Confirmation may take a moment</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Refresh your tenant dashboard shortly to see the final payment and
              agreement status. The URL alone is not treated as proof of
              payment.
            </p>
            {sessionId && (
              <p className="mt-3 font-mono text-xs text-muted-foreground">
                Session reference: ••••{sessionId.slice(-8)}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-5">
        <div className="flex gap-3">
          <ListChecks className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <div>
            <p className="font-medium">What happens next?</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              After webhook confirmation, the rental becomes Active. When the
              tenancy has ended, open Rental requests and choose Complete
              rental. The Leave review action will then become available.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/tenant">
            <ReceiptText /> View tenant dashboard
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/dashboard/tenant/requests">View rental requests</Link>
        </Button>
      </div>
    </Card>
  )
}
