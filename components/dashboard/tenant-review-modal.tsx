"use client"

import * as React from "react"
import { LoaderCircle, Star } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { ReviewApiError, submitReview } from "@/services/review.service"

type TenantReviewModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  rentalAgreementId: string
  propertyTitle: string
}

export function TenantReviewModal({
  open,
  onOpenChange,
  rentalAgreementId,
  propertyTitle,
}: TenantReviewModalProps) {
  const [rating, setRating] = React.useState(5)
  const [hoverRating, setHoverRating] = React.useState<number | null>(null)
  const [comment, setComment] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!comment.trim()) {
      toast.error("Please enter a review comment.")
      return
    }

    setIsSubmitting(true)
    try {
      await submitReview(rentalAgreementId, {
        rating,
        comment: comment.trim(),
      })
      toast.success("Thank you for your feedback!", {
        description: "Your review has been submitted successfully.",
      })
      onOpenChange(false)
      setComment("")
    } catch (error) {
      toast.error("Review submission failed", {
        description:
          error instanceof ReviewApiError
            ? error.message
            : "Something went wrong. Please try again.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const activeRating = hoverRating ?? rating

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Leave a Property Review</DialogTitle>
          <DialogDescription>
            Share your experience living at{" "}
            <span className="font-medium text-foreground">{propertyTitle}</span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2 text-center">
            <label className="text-sm font-medium">Your Rating</label>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="p-1 transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`size-8 ${
                      star <= activeRating
                        ? "fill-amber-400 text-amber-400"
                        : "text-muted-foreground/40"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              {activeRating === 5 && "Excellent! Highly recommended"}
              {activeRating === 4 && "Very Good - Satisfied overall"}
              {activeRating === 3 && "Average - Met basic needs"}
              {activeRating === 2 && "Poor - Had significant issues"}
              {activeRating === 1 && "Terrible - Would not recommend"}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Your Review & Comments
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="How was the property condition, location, landlord responsiveness, and overall experience?"
            />
          </div>

          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />{" "}
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
