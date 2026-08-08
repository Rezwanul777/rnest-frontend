"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Inbox,
  LoaderCircle,
  Mail,
  MapPin,
  X,
} from "lucide-react"
import { toast } from "sonner"

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
import {
  RentalRequestApiError,
  updateRentalRequestStatus,
} from "@/services/rental-request.service"
import type { PaginationMeta } from "@/types/api"
import type {
  RentalRequest,
  RentalRequestStatus,
  UpdateRentalRequestStatus,
} from "@/types/rental-request"

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

type LandlordRentalRequestListProps = {
  initialRequests: RentalRequest[]
  meta: PaginationMeta
  activeStatus?: RentalRequestStatus
}

function createPageHref(page: number, status?: RentalRequestStatus) {
  const params = new URLSearchParams()
  if (page > 1) params.set("page", String(page))
  if (status) params.set("status", status)

  const query = params.toString()
  return query
    ? `/dashboard/landlord/requests?${query}`
    : "/dashboard/landlord/requests"
}

export function LandlordRentalRequestList({
  initialRequests,
  meta,
  activeStatus,
}: LandlordRentalRequestListProps) {
  const router = useRouter()
  const [requests, setRequests] = React.useState(initialRequests)
  const [pendingId, setPendingId] = React.useState<string | null>(null)

  async function changeStatus(
    requestId: string,
    nextStatus: UpdateRentalRequestStatus
  ) {
    const snapshot = requests
    const selectedRequest = requests.find((item) => item.id === requestId)
    if (!selectedRequest || selectedRequest.status !== "PENDING") return

    setPendingId(requestId)
    setRequests((current) =>
      current.map((item) => {
        if (item.id === requestId) return { ...item, status: nextStatus }

        if (
          nextStatus === "APPROVED" &&
          item.propertyId === selectedRequest.propertyId &&
          item.status === "PENDING"
        ) {
          return { ...item, status: "REJECTED" }
        }

        return item
      })
    )

    try {
      const result = await updateRentalRequestStatus(requestId, nextStatus)
      toast.success(
        nextStatus === "APPROVED" ? "Request approved" : "Request rejected",
        { description: result.message }
      )
      router.refresh()
    } catch (error) {
      setRequests(snapshot)
      toast.error("Request update failed", {
        description:
          error instanceof RentalRequestApiError
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setPendingId(null)
    }
  }

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Landlord workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Incoming rental requests
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review tenant details and approve or reject pending requests. An
            approval creates the rental agreement and unlocks tenant payment.
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
            ? `/dashboard/landlord/requests?status=${item.value}`
            : "/dashboard/landlord/requests"

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
            <Inbox className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">No requests found</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            {activeStatus
              ? `There are no ${activeStatus.toLowerCase()} requests for your properties.`
              : "New tenant requests for your properties will appear here."}
          </p>
        </Card>
      ) : (
        <Card className="overflow-hidden bg-card/90">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Request details</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => {
                const isUpdating = pendingId === request.id

                return (
                  <TableRow
                    key={request.id}
                    className={cn(isUpdating && "opacity-60")}
                  >
                    <TableCell className="min-w-52">
                      <p className="font-medium">
                        {request.tenant?.name ?? "Tenant"}
                      </p>
                      {request.tenant?.email && (
                        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Mail className="size-3" /> {request.tenant.email}
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="min-w-60">
                      <Link
                        href={`/properties/${request.property.id}`}
                        className="font-medium hover:underline"
                      >
                        {request.property.title}
                      </Link>
                      <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="size-3" />{" "}
                        {request.property.location}
                      </p>
                      <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                        ৳{takaFormatter.format(Number(request.property.rent))}
                        /month
                      </p>
                    </TableCell>
                    <TableCell className="min-w-64">
                      <p className="flex items-center gap-2 text-sm">
                        <CalendarDays className="size-4 text-muted-foreground" />
                        {dateFormatter.format(
                          new Date(request.requestedMoveInDate)
                        )}
                      </p>
                      <p className="mt-2 flex items-center gap-2 text-sm">
                        <Clock3 className="size-4 text-muted-foreground" />
                        {request.durationInMonths} months
                      </p>
                      {request.tenantMessage && (
                        <p className="mt-2 max-w-xs text-xs leading-5 text-muted-foreground">
                          “{request.tenantMessage}”
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <RentalRequestStatusBadge status={request.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {request.status === "PENDING" ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            disabled={pendingId !== null}
                            onClick={() => changeStatus(request.id, "REJECTED")}
                          >
                            {isUpdating ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              <X />
                            )}
                            Reject
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            disabled={pendingId !== null}
                            onClick={() => changeStatus(request.id, "APPROVED")}
                          >
                            {isUpdating ? (
                              <LoaderCircle className="animate-spin" />
                            ) : (
                              <Check />
                            )}
                            Approve
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Decision recorded
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
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
