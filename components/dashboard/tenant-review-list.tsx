import { CalendarDays, House, MessageSquareText, Star } from "lucide-react"

import { RentalAgreementStatusBadge } from "@/components/dashboard/rental-agreement-status-badge"
import { ReviewFormDialog } from "@/components/dashboard/review-form-dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { RentalAgreement } from "@/types/rental-agreement"

const dateFormatter = new Intl.DateTimeFormat("en-BD", {
  day: "numeric",
  month: "short",
  year: "numeric",
})

type TenantReviewListProps = {
  agreements: RentalAgreement[]
}

function formatDate(value: string | null) {
  return value ? dateFormatter.format(new Date(value)) : "Not set"
}

function ReadonlyStars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "size-4",
            index < rating
              ? "fill-amber-500 text-amber-500"
              : "text-muted-foreground/35"
          )}
        />
      ))}
    </div>
  )
}

export function TenantReviewList({ agreements }: TenantReviewListProps) {
  const submittedCount = agreements.filter(
    (agreement) => agreement.review
  ).length
  const waitingCount = agreements.length - submittedCount

  return (
    <div className="space-y-7">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge variant="outline">Tenant workspace</Badge>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            My reviews
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review completed or ended rentals and keep track of feedback you
            have already submitted.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-3 py-1.5">
            {submittedCount} submitted
          </Badge>
          <Badge variant="outline" className="px-3 py-1.5">
            {waitingCount} waiting
          </Badge>
        </div>
      </section>

      {agreements.length === 0 ? (
        <Card className="items-center bg-card/90 px-6 py-16 text-center">
          <span className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
            <MessageSquareText className="size-6" />
          </span>
          <h2 className="mt-5 text-xl font-semibold">
            No rentals are ready for review
          </h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            When an active rental is completed or terminated, it will appear
            here and you can submit one review.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {agreements.map((agreement) => (
            <Card key={agreement.id} className="bg-card/90 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    <House className="size-4" /> Rental property
                  </p>
                  <h2 className="mt-2 text-xl font-semibold">
                    {agreement.property.title}
                  </h2>
                </div>
                <RentalAgreementStatusBadge status={agreement.status} />
              </div>

              <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="size-4" />
                {formatDate(agreement.leaseStartDate)} to{" "}
                {formatDate(agreement.leaseEndDate)}
              </p>

              {agreement.review ? (
                <div className="mt-5 rounded-xl border bg-muted/30 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <ReadonlyStars rating={agreement.review.rating} />
                    <span className="text-xs text-muted-foreground">
                      Submitted {formatDate(agreement.review.createdAt)}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {agreement.review.comment || "No written comment provided."}
                  </p>
                </div>
              ) : (
                <div className="mt-5 flex flex-col gap-4 rounded-xl border border-amber-400/25 bg-amber-400/10 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium">Share your experience</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Rating is required; a written comment is optional.
                    </p>
                  </div>
                  <ReviewFormDialog
                    rentalAgreementId={agreement.id}
                    propertyTitle={agreement.property.title}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
