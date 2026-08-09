"use client"

import { useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, LoaderCircle } from "lucide-react"
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
import {
  completeRentalAgreement,
  RentalAgreementStatusApiError,
} from "@/services/rental-agreement-status.service"

type CompleteRentalDialogProps = {
  rentalAgreementId: string
  propertyTitle: string
}

export function CompleteRentalDialog({
  rentalAgreementId,
  propertyTitle,
}: CompleteRentalDialogProps) {
  const router = useRouter()
  const submittingRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  async function handleCompleteRental() {
    if (submittingRef.current) return

    submittingRef.current = true
    setIsPending(true)
    setErrorMessage(null)

    try {
      await completeRentalAgreement(rentalAgreementId)

      toast.success("Rental completed", {
        description: `You can now leave a review for ${propertyTitle}.`,
      })
      setOpen(false)
      router.refresh()
    } catch (error) {
      const message =
        error instanceof RentalAgreementStatusApiError
          ? error.message
          : "Something went wrong. Please try again."

      setErrorMessage(message)
      toast.error("Could not complete rental", { description: message })

      if (
        error instanceof RentalAgreementStatusApiError &&
        error.status === 401
      ) {
        router.push("/auth/login?redirect=/dashboard/tenant/requests")
      }
    } finally {
      submittingRef.current = false
      setIsPending(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (isPending) return
        setOpen(nextOpen)
        if (!nextOpen) setErrorMessage(null)
      }}
    >
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <CheckCircle2 /> Complete rental
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Complete this rental?</DialogTitle>
          <DialogDescription>
            Confirm only after your rental at {propertyTitle} has ended. This
            changes the agreement to Completed and unlocks the review form.
          </DialogDescription>
        </DialogHeader>

        {errorMessage && (
          <div
            className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
            role="alert"
          >
            {errorMessage}
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Keep active
            </Button>
          </DialogClose>
          <Button
            type="button"
            disabled={isPending}
            onClick={handleCompleteRental}
          >
            {isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              <CheckCircle2 />
            )}
            {isPending ? "Completing..." : "Confirm completion"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
