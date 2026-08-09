import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CreditCard,
  ReceiptText,
  ShieldCheck,
} from "lucide-react"

import { PaymentStatusBadge } from "@/components/dashboard/payment-status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type { PaginationMeta } from "@/types/api"
import type { Payment, PaymentStatus } from "@/types/payment"

const statuses: Array<{ label: string; value?: PaymentStatus }> = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Processing", value: "PROCESSING" },
  { label: "Paid", value: "PAID" },
  { label: "Failed", value: "FAILED" },
  { label: "Refunded", value: "REFUNDED" },
  { label: "Cancelled", value: "CANCELLED" },
]

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

type TenantPaymentHistoryProps = {
  payments: Payment[]
  meta: PaginationMeta
  activeStatus?: PaymentStatus
}

function createPageHref(page: number, status?: PaymentStatus) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (status) params.set("status", status)

  const query = params.toString()
  return query
    ? `/dashboard/tenant/payments?${query}`
    : "/dashboard/tenant/payments"
}

function formatAmount(payment: Payment) {
  const amount = Number(payment.amount)
  const currency = payment.currency.toUpperCase()

  if (!Number.isFinite(amount)) return `${currency} ${payment.amount}`

  try {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString("en-BD")}`
  }
}

function formatPaymentDate(payment: Payment) {
  const value = payment.paidAt ?? payment.createdAt
  return dateFormatter.format(new Date(value))
}

export function TenantPaymentHistory({
  payments,
  meta,
  activeStatus,
}: TenantPaymentHistoryProps) {
  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Tenant workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Payment history
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review Stripe rental payments, confirmation status, and transaction
            dates returned by the RentNest backend.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {meta.total} {meta.total === 1 ? "payment" : "payments"}
        </Badge>
      </section>

      <nav
        className="flex gap-2 overflow-x-auto pb-1"
        aria-label="Filter payment history by status"
      >
        {statuses.map((item) => {
          const active = item.value === activeStatus
          const href = item.value
            ? `/dashboard/tenant/payments?status=${item.value}`
            : "/dashboard/tenant/payments"

          return (
            <Link
              key={item.label}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-background/70 text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>

      {payments.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ReceiptText className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No payments found</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {activeStatus
              ? `You do not have any ${activeStatus.toLowerCase()} payments.`
              : "Payments appear here after an approved rental agreement reaches checkout."}
          </p>
          <Button className="mt-5" asChild>
            <Link href="/dashboard/tenant/requests">
              <ArrowLeft /> View rental requests
            </Link>
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card/90">
          <div className="flex gap-3 border-b bg-muted/20 px-5 py-4">
            <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <p className="text-sm leading-6 text-muted-foreground">
              Payment status comes from the backend after Stripe webhook
              verification. The success-page URL does not change this table.
            </p>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Payment</TableHead>
                <TableHead>Agreement</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="min-w-40">
                    <p className="flex items-center gap-2 font-medium">
                      <ReceiptText className="size-4 text-muted-foreground" />
                      {payment.id.slice(0, 8)}…
                    </p>
                    <p className="mt-1 pl-6 text-xs text-muted-foreground">
                      Transaction ID
                    </p>
                  </TableCell>
                  <TableCell className="min-w-40 font-mono text-xs text-muted-foreground">
                    {payment.rentalAgreementId.slice(0, 8)}…
                  </TableCell>
                  <TableCell className="min-w-36 font-semibold">
                    {formatAmount(payment)}
                  </TableCell>
                  <TableCell className="min-w-48">
                    <p className="flex items-center gap-2 text-sm">
                      <CalendarClock className="size-4 text-muted-foreground" />
                      {formatPaymentDate(payment)}
                    </p>
                    <p className="mt-1 pl-6 text-xs text-muted-foreground">
                      {payment.paidAt ? "Paid at" : "Created at"}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center gap-2 text-sm font-medium">
                      <CreditCard className="size-4 text-indigo-500" />
                      {payment.provider}
                    </span>
                  </TableCell>
                  <TableCell className="min-w-36">
                    <PaymentStatusBadge status={payment.status} />
                    {payment.failureReason && (
                      <p className="mt-1 max-w-48 text-xs text-destructive">
                        {payment.failureReason}
                      </p>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {meta.totalPages > 1 && (
        <nav
          className="flex items-center justify-between border-t pt-5"
          aria-label="Payment history pagination"
        >
          <Button
            variant="outline"
            disabled={meta.page <= 1}
            asChild={meta.page > 1}
          >
            {meta.page > 1 ? (
              <Link href={createPageHref(meta.page - 1, activeStatus)}>
                <ArrowLeft /> Previous
              </Link>
            ) : (
              <span>
                <ArrowLeft /> Previous
              </span>
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {meta.page} of {meta.totalPages}
          </p>
          <Button
            variant="outline"
            disabled={meta.page >= meta.totalPages}
            asChild={meta.page < meta.totalPages}
          >
            {meta.page < meta.totalPages ? (
              <Link href={createPageHref(meta.page + 1, activeStatus)}>
                Next <ArrowRight />
              </Link>
            ) : (
              <span>
                Next <ArrowRight />
              </span>
            )}
          </Button>
        </nav>
      )}
    </div>
  )
}
