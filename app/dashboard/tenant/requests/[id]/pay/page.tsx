import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  House,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react"

import { RentalAgreementStatusBadge } from "@/components/dashboard/rental-agreement-status-badge"
import { StripeCheckoutButton } from "@/components/dashboard/stripe-checkout-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { requireRole } from "@/lib/require-role"
import { getTenantRentalAgreementById } from "@/services/tenant-rental-agreement.service"

export const metadata: Metadata = {
  title: "Secure payment",
}

type TenantPaymentPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ agreementId?: string }>
}

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "Not set"
}

export default async function TenantPaymentPage({
  params,
  searchParams,
}: TenantPaymentPageProps) {
  await requireRole("TENANT")

  const [{ id: requestId }, query] = await Promise.all([params, searchParams])
  const agreementId = query.agreementId?.trim()

  if (!agreementId) notFound()

  const agreement = await getTenantRentalAgreementById(agreementId)

  if (!agreement) notFound()

  const canPay = agreement.status === "PENDING_PAYMENT"

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-2">
      <Button variant="ghost" asChild>
        <Link href="/dashboard/tenant/requests">
          <ArrowLeft /> Back to rental requests
        </Link>
      </Button>

      <div>
        <Badge variant="outline">Secure checkout</Badge>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Complete your rental payment
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Review the agreement below. Stripe will show the final amount and
          collect your card details on its hosted checkout page.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.72fr]">
        <Card className="bg-card/90 p-6 sm:p-8">
          <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rental property</p>
              <h2 className="mt-1 text-2xl font-semibold">
                {agreement.property.title}
              </h2>
            </div>
            <RentalAgreementStatusBadge status={agreement.status} />
          </div>

          <dl className="grid gap-5 py-6 sm:grid-cols-2">
            <div className="rounded-xl border bg-muted/30 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <CalendarDays className="size-4" /> Lease starts
              </dt>
              <dd className="mt-2 font-medium">
                {formatDate(agreement.leaseStartDate)}
              </dd>
            </div>
            <div className="rounded-xl border bg-muted/30 p-4">
              <dt className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                <CalendarDays className="size-4" /> Lease ends
              </dt>
              <dd className="mt-2 font-medium">
                {formatDate(agreement.leaseEndDate)}
              </dd>
            </div>
          </dl>

          <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 p-4">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm font-medium">
                  Amount confirmed by backend
                </p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  RentNest creates the payable amount from this rental
                  agreement. Never enter or calculate an amount in the browser.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {canPay ? (
              <StripeCheckoutButton agreementId={agreement.id} />
            ) : agreement.status === "ACTIVE" ? (
              <div className="flex gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-4 text-sm">
                <CheckCircle2 className="size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <p>Payment is complete and this rental agreement is active.</p>
              </div>
            ) : (
              <p className="rounded-xl border bg-muted/40 p-4 text-sm text-muted-foreground">
                Payment is not available for an agreement with this status.
              </p>
            )}
          </div>
        </Card>

        <Card className="h-fit bg-card/90 p-6">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <LockKeyhole className="size-5" />
          </span>
          <h2 className="mt-5 text-lg font-semibold">Hosted by Stripe</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Card information is entered on Stripe&apos;s secure page. RentNest
            never stores your card number.
          </p>
          <div className="mt-5 space-y-3 border-t pt-5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <House className="size-4" /> Agreement {agreement.id.slice(-8)}
            </p>
            <p>Request {requestId.slice(-8)}</p>
          </div>
          <Button variant="outline" className="mt-6 w-full" asChild>
            <Link href={`/properties/${agreement.property.id}`}>
              View property
            </Link>
          </Button>
        </Card>
      </div>
    </div>
  )
}
