import Link from "next/link"
import { XCircle, ArrowLeft, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PaymentCancelPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <Card className="overflow-hidden bg-card/90 text-center border-destructive/20 shadow-2xl">
        <div className="bg-destructive/10 py-10 flex flex-col items-center justify-center border-b border-destructive/10">
          <div className="flex size-20 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow-lg shadow-destructive/30">
            <XCircle className="size-10" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Payment Cancelled
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your transaction was cancelled or could not be completed.
          </p>
        </div>

        <CardContent className="p-8 space-y-6">
          <p className="text-sm leading-6 text-muted-foreground">
            No funds were deducted. You can retry your payment at any time from your tenant requests dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" asChild>
              <Link href="/dashboard/tenant/requests">
                <RefreshCw className="mr-2 size-4" /> Retry from dashboard
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/properties">
                <ArrowLeft className="mr-2 size-4" /> Return to properties
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
