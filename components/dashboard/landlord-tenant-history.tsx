import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  History,
  UserRound,
} from "lucide-react"

import { RentalAgreementStatusBadge } from "@/components/dashboard/rental-agreement-status-badge"
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
import type { RentalAgreement } from "@/types/rental-agreement"
import type { RentalAgreementStatus } from "@/types/rental-request"

const statuses: Array<{
  label: string
  value?: RentalAgreementStatus
}> = [
  { label: "All" },
  { label: "Pending payment", value: "PENDING_PAYMENT" },
  { label: "Active", value: "ACTIVE" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Terminated", value: "TERMINATED" },
  { label: "Cancelled", value: "CANCELLED" },
]

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

type LandlordTenantHistoryProps = {
  agreements: RentalAgreement[]
  meta: PaginationMeta
  activeStatus?: RentalAgreementStatus
}

function createPageHref(page: number, status?: RentalAgreementStatus) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (status) params.set("status", status)

  const query = params.toString()
  return query
    ? `/dashboard/landlord/tenants?${query}`
    : "/dashboard/landlord/tenants"
}

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "Not set"
}

export function LandlordTenantHistory({
  agreements,
  meta,
  activeStatus,
}: LandlordTenantHistoryProps) {
  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Landlord workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Tenant history
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review rental agreements connected to your properties, including
            pending payments, active leases, and completed stays.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {meta.total} {meta.total === 1 ? "agreement" : "agreements"}
        </Badge>
      </section>

      <nav
        className="flex gap-2 overflow-x-auto pb-1"
        aria-label="Filter tenant history by agreement status"
      >
        {statuses.map((item) => {
          const active = item.value === activeStatus
          const href = item.value
            ? `/dashboard/landlord/tenants?status=${item.value}`
            : "/dashboard/landlord/tenants"

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

      {agreements.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <History className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">
            No tenant history found
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {activeStatus
              ? `There are no ${activeStatus.toLowerCase().replace("_", " ")} agreements.`
              : "Approved tenant requests create rental agreements that will appear here."}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card/90">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Lease period</TableHead>
                <TableHead>Activated</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agreements.map((agreement) => (
                <TableRow key={agreement.id}>
                  <TableCell className="min-w-48">
                    <p className="flex items-center gap-2 font-medium">
                      <UserRound className="size-4 text-muted-foreground" />
                      {agreement.tenant.name}
                    </p>
                    <p className="mt-1 pl-6 text-xs text-muted-foreground">
                      Tenant ID: {agreement.tenant.id.slice(0, 8)}…
                    </p>
                  </TableCell>
                  <TableCell className="min-w-60">
                    <Link
                      href={`/dashboard/landlord/properties/${agreement.property.id}/edit`}
                      className="flex items-center gap-2 font-medium hover:underline"
                    >
                      <Building2 className="size-4 text-amber-500" />
                      {agreement.property.title}
                    </Link>
                  </TableCell>
                  <TableCell className="min-w-60">
                    <p className="flex items-center gap-2 text-sm">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      {formatDate(agreement.leaseStartDate)}
                    </p>
                    <p className="mt-1 pl-6 text-xs text-muted-foreground">
                      to {formatDate(agreement.leaseEndDate)}
                    </p>
                  </TableCell>
                  <TableCell className="min-w-36 text-sm text-muted-foreground">
                    {formatDate(agreement.activatedAt)}
                  </TableCell>
                  <TableCell>
                    <RentalAgreementStatusBadge status={agreement.status} />
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
          aria-label="Tenant history pagination"
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
