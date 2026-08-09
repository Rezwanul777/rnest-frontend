"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarClock,
  CreditCard,
  FileSearch,
  Mail,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
  UserRound,
  WalletCards,
} from "lucide-react"

import { PaymentStatusBadge } from "@/components/dashboard/payment-status-badge"
import { RentalAgreementStatusBadge } from "@/components/dashboard/rental-agreement-status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { PaginationMeta } from "@/types/api"
import type { Payment, PaymentStatus } from "@/types/payment"

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

type AdminPaymentOversightProps = {
  payments: Payment[]
  meta: PaginationMeta
  activeSearch: string
  activeStatus?: PaymentStatus
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
  return dateFormatter.format(new Date(payment.paidAt ?? payment.createdAt))
}

function createPageHref(page: number, search: string, status?: PaymentStatus) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (search) params.set("search", search)
  if (status) params.set("status", status)

  const query = params.toString()
  return query
    ? `/dashboard/admin/payments?${query}`
    : "/dashboard/admin/payments"
}

export function AdminPaymentOversight({
  payments,
  meta,
  activeSearch,
  activeStatus,
}: AdminPaymentOversightProps) {
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(
    null
  )
  const hasFilters = Boolean(activeSearch || activeStatus)

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Admin workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Payment oversight
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Inspect Stripe payment records, linked rental agreements, and
            platform transaction outcomes without changing webhook-owned data.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {meta.total} {meta.total === 1 ? "payment" : "payments"}
        </Badge>
      </section>

      <Card className="bg-card/90 p-4">
        <form
          action="/dashboard/admin/payments"
          method="get"
          className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_200px_auto]"
        >
          <label className="relative">
            <span className="sr-only">Search payments</span>
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={activeSearch}
              placeholder="Tenant, email, property or location..."
              className="h-10 pl-9"
            />
          </label>
          <label>
            <span className="sr-only">Payment status</span>
            <select
              name="status"
              defaultValue={activeStatus ?? ""}
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="PAID">Paid</option>
              <option value="FAILED">Failed</option>
              <option value="REFUNDED">Refunded</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>
          <div className="flex gap-2">
            <Button type="submit" className="h-10 flex-1">
              Apply filters
            </Button>
            {hasFilters && (
              <Button
                type="button"
                variant="outline"
                size="icon-lg"
                className="h-10 w-10"
                asChild
              >
                <Link
                  href="/dashboard/admin/payments"
                  aria-label="Clear payment filters"
                >
                  <RotateCcw />
                </Link>
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="flex-row gap-3 border-emerald-500/20 bg-emerald-500/5 p-4">
        <ShieldCheck className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
        <p className="text-sm leading-6 text-muted-foreground">
          Stripe webhook verification is the source of truth. This admin page
          intentionally provides inspection only—URL parameters and UI actions
          cannot mark a payment as paid.
        </p>
      </Card>

      {payments.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <WalletCards className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No payments found</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {hasFilters
              ? "No Stripe payments match the current search and status filter."
              : "No platform payments have reached checkout yet."}
          </p>
          {hasFilters && (
            <Button className="mt-5" variant="outline" asChild>
              <Link href="/dashboard/admin/payments">
                <RotateCcw /> Clear filters
              </Link>
            </Button>
          )}
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card/90">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Inspect</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="min-w-52">
                    <p className="font-medium">
                      {payment.rentalAgreement?.tenant.name ??
                        "Tenant relation unavailable"}
                    </p>
                    {payment.rentalAgreement?.tenant.email && (
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Mail className="size-3" />
                        {payment.rentalAgreement.tenant.email}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="min-w-60">
                    <p className="font-medium">
                      {payment.rentalAgreement?.property.title ??
                        "Property relation unavailable"}
                    </p>
                    {payment.rentalAgreement?.property.location && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {payment.rentalAgreement.property.location}
                      </p>
                    )}
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
                  <TableCell className="min-w-36">
                    <PaymentStatusBadge status={payment.status} />
                    {payment.failureReason && (
                      <p className="mt-2 max-w-52 text-xs text-destructive">
                        {payment.failureReason}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedPayment(payment)}
                    >
                      <FileSearch /> Details
                    </Button>
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
          aria-label="Payment oversight pagination"
        >
          <Button
            variant="outline"
            disabled={meta.page <= 1}
            asChild={meta.page > 1}
          >
            {meta.page > 1 ? (
              <Link
                href={createPageHref(meta.page - 1, activeSearch, activeStatus)}
              >
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
              <Link
                href={createPageHref(meta.page + 1, activeSearch, activeStatus)}
              >
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

      <Dialog
        open={Boolean(selectedPayment)}
        onOpenChange={(open) => {
          if (!open) setSelectedPayment(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment details</DialogTitle>
            <DialogDescription>
              Read-only backend and Stripe references for this transaction.
            </DialogDescription>
          </DialogHeader>

          {selectedPayment && (
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailCard
                icon={ReceiptText}
                label="Payment"
                title={formatAmount(selectedPayment)}
                lines={[
                  `Payment ID: ${selectedPayment.id}`,
                  `Provider: ${selectedPayment.provider}`,
                ]}
              />
              <div className="rounded-xl border bg-muted/25 p-4">
                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Status
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <PaymentStatusBadge status={selectedPayment.status} />
                  {selectedPayment.rentalAgreement && (
                    <RentalAgreementStatusBadge
                      status={selectedPayment.rentalAgreement.status}
                    />
                  )}
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Created{" "}
                  {dateFormatter.format(new Date(selectedPayment.createdAt))}
                </p>
                {selectedPayment.paidAt && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Paid{" "}
                    {dateFormatter.format(new Date(selectedPayment.paidAt))}
                  </p>
                )}
              </div>
              <DetailCard
                icon={UserRound}
                label="Tenant"
                title={
                  selectedPayment.rentalAgreement?.tenant.name ??
                  "Relation unavailable"
                }
                lines={
                  selectedPayment.rentalAgreement
                    ? [
                        selectedPayment.rentalAgreement.tenant.email,
                        `ID: ${selectedPayment.rentalAgreement.tenant.id}`,
                      ]
                    : ["Deploy the backend relation update in this step."]
                }
              />
              <DetailCard
                icon={Building2}
                label="Property"
                title={
                  selectedPayment.rentalAgreement?.property.title ??
                  "Relation unavailable"
                }
                lines={
                  selectedPayment.rentalAgreement
                    ? [
                        selectedPayment.rentalAgreement.property.location,
                        `ID: ${selectedPayment.rentalAgreement.property.id}`,
                      ]
                    : ["Deploy the backend relation update in this step."]
                }
              />
              <DetailCard
                icon={CreditCard}
                label="Stripe references"
                title={selectedPayment.stripePaymentIntentId ?? "Not assigned"}
                lines={[
                  `Session: ${selectedPayment.stripeSessionId ?? "Not assigned"}`,
                ]}
                className="sm:col-span-2"
              />
              {selectedPayment.failureReason && (
                <div className="rounded-xl border border-destructive/25 bg-destructive/10 p-4 text-sm text-destructive sm:col-span-2">
                  <p className="font-medium">Failure reason</p>
                  <p className="mt-1 leading-6">
                    {selectedPayment.failureReason}
                  </p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

type DetailCardProps = {
  icon: React.ComponentType<{ className?: string }>
  label: string
  title: string
  lines: string[]
  className?: string
}

function DetailCard({
  icon: Icon,
  label,
  title,
  lines,
  className,
}: DetailCardProps) {
  return (
    <div className={`rounded-xl border bg-muted/25 p-4 ${className ?? ""}`}>
      <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
        <Icon className="size-4" /> {label}
      </p>
      <p className="mt-3 font-medium break-all">{title}</p>
      {lines.map((line) => (
        <p
          key={line}
          className="mt-1 text-xs leading-5 break-all text-muted-foreground"
        >
          {line}
        </p>
      ))}
    </div>
  )
}
