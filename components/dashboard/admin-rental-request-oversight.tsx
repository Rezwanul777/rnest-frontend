"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Clock3,
  FileSearch,
  Mail,
  MapPin,
  MessageSquareText,
  RotateCcw,
  Search,
  UserRound,
} from "lucide-react"

import { RentalAgreementStatusBadge } from "@/components/dashboard/rental-agreement-status-badge"
import { RentalRequestStatusBadge } from "@/components/dashboard/rental-request-status-badge"
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
import type { RentalRequest, RentalRequestStatus } from "@/types/rental-request"

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

const dateTimeFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
})

const takaFormatter = new Intl.NumberFormat("en-BD")

type AdminRentalRequestOversightProps = {
  requests: RentalRequest[]
  meta: PaginationMeta
  activeSearch: string
  activeStatus?: RentalRequestStatus
}

function createPageHref(
  page: number,
  search: string,
  status?: RentalRequestStatus
) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (search) params.set("search", search)
  if (status) params.set("status", status)

  const query = params.toString()
  return query
    ? `/dashboard/admin/requests?${query}`
    : "/dashboard/admin/requests"
}

export function AdminRentalRequestOversight({
  requests,
  meta,
  activeSearch,
  activeStatus,
}: AdminRentalRequestOversightProps) {
  const [selectedRequest, setSelectedRequest] =
    React.useState<RentalRequest | null>(null)
  const hasFilters = Boolean(activeSearch || activeStatus)

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Admin workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Rental request oversight
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Inspect tenant requests and their linked property or agreement data
            across the platform. Approval decisions remain with each landlord.
          </p>
        </div>
        <Badge variant="secondary" className="px-3 py-1.5">
          {meta.total} {meta.total === 1 ? "request" : "requests"}
        </Badge>
      </section>

      <Card className="bg-card/90 p-4">
        <form
          action="/dashboard/admin/requests"
          method="get"
          className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_200px_auto]"
        >
          <label className="relative">
            <span className="sr-only">Search rental requests</span>
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              name="search"
              defaultValue={activeSearch}
              placeholder="Tenant, email, property or location..."
              className="h-10 pl-9"
            />
          </label>
          <label>
            <span className="sr-only">Request status</span>
            <select
              name="status"
              defaultValue={activeStatus ?? ""}
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">All statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
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
                  href="/dashboard/admin/requests"
                  aria-label="Clear rental request filters"
                >
                  <RotateCcw />
                </Link>
              </Button>
            )}
          </div>
        </form>
      </Card>

      {requests.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <FileSearch className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No requests found</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {hasFilters
              ? "No rental requests match the current search and status filter."
              : "No tenant rental requests are currently available for inspection."}
          </p>
          {hasFilters && (
            <Button className="mt-5" variant="outline" asChild>
              <Link href="/dashboard/admin/requests">
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
                <TableHead>Move-in plan</TableHead>
                <TableHead>Request</TableHead>
                <TableHead>Agreement</TableHead>
                <TableHead className="text-right">Inspect</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="min-w-52">
                    <p className="font-medium">
                      {request.tenant?.name ?? "Tenant unavailable"}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Mail className="size-3" />
                      {request.tenant?.email ?? "Email unavailable"}
                    </p>
                  </TableCell>
                  <TableCell className="min-w-60">
                    <p className="font-medium">{request.property.title}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin className="size-3" /> {request.property.location}
                    </p>
                    <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                      ৳{takaFormatter.format(Number(request.property.rent))}
                      /month
                    </p>
                  </TableCell>
                  <TableCell className="min-w-48">
                    <p className="flex items-center gap-2 text-sm">
                      <CalendarDays className="size-4 text-muted-foreground" />
                      {dateFormatter.format(
                        new Date(request.requestedMoveInDate)
                      )}
                    </p>
                    <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock3 className="size-4" /> {request.durationInMonths}{" "}
                      months
                    </p>
                  </TableCell>
                  <TableCell>
                    <RentalRequestStatusBadge status={request.status} />
                  </TableCell>
                  <TableCell>
                    {request.rentalAgreement ? (
                      <RentalAgreementStatusBadge
                        status={request.rentalAgreement.status}
                      />
                    ) : (
                      <Badge variant="outline">Not created</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedRequest(request)}
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
          aria-label="Rental request oversight pagination"
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
        open={Boolean(selectedRequest)}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null)
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Rental request details</DialogTitle>
            <DialogDescription>
              Read-only platform record. Landlords approve or reject pending
              requests from their own workspace.
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="grid gap-4 sm:grid-cols-2">
              <DetailCard
                icon={UserRound}
                label="Tenant"
                title={selectedRequest.tenant?.name ?? "Tenant unavailable"}
                lines={[
                  selectedRequest.tenant?.email ?? "Email unavailable",
                  `ID: ${selectedRequest.tenantId}`,
                ]}
              />
              <DetailCard
                icon={Building2}
                label="Property"
                title={selectedRequest.property.title}
                lines={[
                  selectedRequest.property.location,
                  `ID: ${selectedRequest.propertyId}`,
                ]}
              />
              <DetailCard
                icon={CalendarDays}
                label="Lease request"
                title={dateFormatter.format(
                  new Date(selectedRequest.requestedMoveInDate)
                )}
                lines={[
                  `${selectedRequest.durationInMonths} months requested`,
                  selectedRequest.createdAt
                    ? `Submitted ${dateTimeFormatter.format(
                        new Date(selectedRequest.createdAt)
                      )}`
                    : "Submission date unavailable",
                ]}
              />
              <div className="rounded-xl border bg-muted/25 p-4">
                <p className="text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  Status records
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <RentalRequestStatusBadge status={selectedRequest.status} />
                  {selectedRequest.rentalAgreement ? (
                    <RentalAgreementStatusBadge
                      status={selectedRequest.rentalAgreement.status}
                    />
                  ) : (
                    <Badge variant="outline">No agreement</Badge>
                  )}
                </div>
                <p className="mt-3 font-mono text-[11px] break-all text-muted-foreground">
                  Request ID: {selectedRequest.id}
                </p>
                {selectedRequest.rentalAgreement && (
                  <p className="mt-1 font-mono text-[11px] break-all text-muted-foreground">
                    Agreement ID: {selectedRequest.rentalAgreement.id}
                  </p>
                )}
              </div>

              <div className="rounded-xl border bg-muted/25 p-4 sm:col-span-2">
                <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
                  <MessageSquareText className="size-4" /> Tenant message
                </p>
                <p className="mt-3 text-sm leading-6">
                  {selectedRequest.tenantMessage?.trim() ||
                    "The tenant did not include a message."}
                </p>
              </div>
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
}

function DetailCard({ icon: Icon, label, title, lines }: DetailCardProps) {
  return (
    <div className="rounded-xl border bg-muted/25 p-4">
      <p className="flex items-center gap-2 text-xs font-medium tracking-[0.16em] text-muted-foreground uppercase">
        <Icon className="size-4" /> {label}
      </p>
      <p className="mt-3 font-medium">{title}</p>
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
