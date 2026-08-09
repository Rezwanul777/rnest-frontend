import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, CircleX, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Payment cancelled",
}

export default function PaymentCancelPage() {
  return (
    <Card className="w-full max-w-2xl bg-card/95 p-7 shadow-xl sm:p-10">
      <span className="flex size-16 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/10 text-amber-600 dark:text-amber-400">
        <CircleX className="size-8" />
      </span>
      <Badge variant="outline" className="mt-6">
        Checkout cancelled
      </Badge>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
        No payment was completed
      </h1>
      <p className="mt-3 max-w-xl leading-7 text-muted-foreground">
        You left Stripe Checkout before completing payment. Your rental
        agreement remains pending, and you can return to your requests to try
        again.
      </p>

      <div className="mt-7 flex gap-3 rounded-xl border bg-muted/35 p-5">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
        <p className="text-sm leading-6 text-muted-foreground">
          RentNest changes an agreement to active only after the backend
          receives a successful Stripe webhook.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button size="lg" asChild>
          <Link href="/dashboard/tenant/requests">
            <ArrowLeft /> Return to rental requests
          </Link>
        </Button>
        <Button size="lg" variant="outline" asChild>
          <Link href="/properties">Browse properties</Link>
        </Button>
      </div>
    </Card>
  )
}
