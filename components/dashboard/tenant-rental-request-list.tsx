import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Home,
  MapPin,
  ReceiptText,
} from "lucide-react"

import { RentalRequestStatusBadge } from "@/components/dashboard/rental-request-status-badge"
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
import type { RentalRequest, RentalRequestStatus } from "@/types/rental-request"

const statuses: Array<{ label: string; value?: RentalRequestStatus }> = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Cancelled", value: "CANCELLED" },
]

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

const takaFormatter = new Intl.NumberFormat("en-BD")

type TenantRentalRequestListProps = {
  requests: RentalRequest[]
  meta: PaginationMeta
  activeStatus?: RentalRequestStatus
}

function formatDate(value: string) {
  return dateFormatter.format(new Date(value))
}

function createPageHref(page: number, status?: RentalRequestStatus) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (status) params.set("status", status)

  const query = params.toString()
  return query
    ? `/dashboard/tenant/requests?${query}`
    : "/dashboard/tenant/requests"
}

function RequestAction({ request }: { request: RentalRequest }) {
  if (request.status === "APPROVED") {
    if (request.rentalAgreement?.id) {
      return (
        <Button size="sm" asChild>
          <Link
            href={`/dashboard/tenant/requests/${request.id}/pay?agreementId=${request.rentalAgreement.id}`}
          >
            Pay now
          </Link>
        </Button>
      )
    }

    return (
      <span className="text-xs text-muted-foreground">
        Payment details pending
      </span>
    )
  }

  if (request.status === "PENDING") {
    return (
      <span className="text-xs text-muted-foreground">Awaiting landlord</span>
    )
  }

  return <span className="text-xs text-muted-foreground">No action</span>
}

export function TenantRentalRequestList({
  requests,
  meta,
  activeStatus,
}: TenantRentalRequestListProps) {
  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Tenant workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Rental requests
          </h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Track every request and continue to payment after landlord approval.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {meta.total} {meta.total === 1 ? "request" : "requests"}
        </Badge>
      </section>

      <nav
        className="flex gap-2 overflow-x-auto pb-1"
        aria-label="Filter rental requests by status"
      >
        {statuses.map((item) => {
          const active = item.value === activeStatus
          const href = item.value
            ? `/dashboard/tenant/requests?status=${item.value}`
            : "/dashboard/tenant/requests"

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

      {requests.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <ReceiptText className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">
            No rental requests found
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {activeStatus
              ? `You do not have any ${activeStatus.toLowerCase()} requests.`
              : "Browse available properties and submit your first rental request."}
          </p>
          <Button className="mt-5" asChild>
            <Link href="/properties">
              <Home /> Browse properties
            </Link>
          </Button>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card/90">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Property</TableHead>
                <TableHead>Move-in</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="min-w-64">
                    <Link
                      href={`/properties/${request.property.id}`}
                      className="font-medium hover:underline"
                    >
                      {request.property.title}
                    </Link>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" /> {request.property.location}
                    </p>
                    <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      ৳{takaFormatter.format(Number(request.property.rent))}
                      /month
                    </p>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      {formatDate(request.requestedMoveInDate)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <span className="flex items-center gap-2">
                      <Clock3 className="size-4 text-muted-foreground" />
                      {request.durationInMonths} months
                    </span>
                  </TableCell>
                  <TableCell>
                    <RentalRequestStatusBadge status={request.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <RequestAction request={request} />
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
          aria-label="Rental request pagination"
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
