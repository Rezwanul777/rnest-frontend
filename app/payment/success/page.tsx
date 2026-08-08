import Link from "next/link"
import { CheckCircle2, Home, ArrowRight, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type PaymentSuccessPageProps = {
  searchParams: Promise<{ agreementId?: string; session_id?: string }>
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const query = await searchParams
  const refId = query.agreementId || query.session_id || "RN-" + Math.floor(100000 + Math.random() * 900000)

  return (
    <main className="mx-auto max-w-2xl px-4 py-20 sm:px-6">
      <Card className="overflow-hidden bg-card/90 text-center border-emerald-500/20 shadow-2xl">
        <div className="bg-emerald-500/10 py-10 flex flex-col items-center justify-center border-b border-emerald-500/10">
          <div className="flex size-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30 animate-pulse">
            <CheckCircle2 className="size-10" />
          </div>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Payment Successful!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your rental agreement is now active. Congratulations on your new home!
          </p>
        </div>

        <CardContent className="p-8 space-y-6">
          <div className="rounded-2xl bg-muted/60 p-4 space-y-3 text-sm text-left">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Status:</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="size-4" /> Confirmed / Active
              </span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Reference / Agreement ID:</span>
              <span className="font-mono text-xs font-semibold">{refId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Payment Date:</span>
              <span>{new Date().toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Button size="lg" asChild>
              <Link href="/dashboard/tenant/requests">
                Go to my requests <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/properties">
                <Home className="mr-2 size-4" /> Browse more properties
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
