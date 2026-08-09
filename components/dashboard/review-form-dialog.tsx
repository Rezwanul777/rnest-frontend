"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoaderCircle, Star } from "lucide-react"
import { useForm, useWatch } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { reviewSchema, type ReviewFormValues } from "@/lib/validations/review"
import { cn } from "@/lib/utils"
import { ReviewApiError, submitReview } from "@/services/review.service"

type ReviewFormDialogProps = {
  rentalAgreementId: string
  propertyTitle: string
}

function getFieldName(field?: string, path?: string) {
  const value = field ?? path
  if (!value) return null

  const name = value.split(".").at(-1)
  return name === "rating" || name === "comment" ? name : null
}

export function ReviewFormDialog({
  rentalAgreementId,
  propertyTitle,
}: ReviewFormDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const {
    control,
    register,
    handleSubmit,
    reset,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  })

  const selectedRating = useWatch({ control, name: "rating" })

  async function onSubmit(values: ReviewFormValues) {
    try {
      await submitReview(rentalAgreementId, {
        rating: values.rating,
        comment: values.comment || undefined,
      })

      toast.success("Review submitted", {
        description: `Thank you for reviewing ${propertyTitle}.`,
      })
      reset()
      setOpen(false)
      router.refresh()
    } catch (error) {
      if (error instanceof ReviewApiError) {
        let hasFieldError = false

        error.fieldErrors.forEach((item) => {
          const field = getFieldName(item.field, item.path)
          if (!field) return

          setError(field, { type: "server", message: item.message })
          hasFieldError = true
        })

        setError("root.server", {
          type: "server",
          message: hasFieldError
            ? "Please correct the highlighted fields."
            : error.message,
        })
        toast.error("Review could not be submitted", {
          description: error.message,
        })

        if (error.status === 401) {
          router.push("/auth/login?redirect=/dashboard/tenant/reviews")
        }

        if (error.status === 409) router.refresh()
      } else {
        const message = "Something went wrong. Please try again."
        setError("root.server", { type: "server", message })
        toast.error(message)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Star /> Leave review
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Review your rental</DialogTitle>
          <DialogDescription>
            Share your experience at {propertyTitle}. One review is allowed per
            completed rental agreement.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-5"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {errors.root?.server?.message && (
            <div
              className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              role="alert"
            >
              {errors.root.server.message}
            </div>
          )}

          <fieldset>
            <legend className="text-sm font-medium">Rating</legend>
            <div className="mt-3 flex gap-2" role="group">
              {Array.from({ length: 5 }, (_, index) => index + 1).map(
                (rating) => (
                  <button
                    key={rating}
                    type="button"
                    aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
                    aria-pressed={selectedRating === rating}
                    className={cn(
                      "flex size-11 items-center justify-center rounded-xl border transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                      rating <= selectedRating
                        ? "border-amber-400/40 bg-amber-400/10 text-amber-500"
                        : "bg-background text-muted-foreground hover:text-amber-500"
                    )}
                    onClick={() =>
                      setValue("rating", rating, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <Star
                      className={cn(
                        "size-5",
                        rating <= selectedRating && "fill-current"
                      )}
                    />
                  </button>
                )
              )}
            </div>
            {errors.rating?.message && (
              <p className="mt-2 text-xs text-destructive">
                {errors.rating.message}
              </p>
            )}
          </fieldset>

          <div>
            <label
              htmlFor={`review-comment-${rentalAgreementId}`}
              className="text-sm font-medium"
            >
              Comment <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id={`review-comment-${rentalAgreementId}`}
              className="mt-2 min-h-32"
              placeholder="What did you like about this rental?"
              aria-invalid={Boolean(errors.comment)}
              {...register("comment")}
            />
            <div className="mt-1.5 flex justify-between gap-4 text-xs">
              <p className="text-destructive">{errors.comment?.message}</p>
              <p className="text-muted-foreground">Maximum 1000 characters</p>
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <LoaderCircle className="animate-spin" /> Submitting...
                </>
              ) : (
                "Submit review"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
