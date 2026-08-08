"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { CalendarDays, CheckCircle2, LoaderCircle } from "lucide-react"
import { useForm } from "react-hook-form"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  rentalRequestSchema,
  type RentalRequestFormValues,
} from "@/lib/validations/rental-request"
import {
  RentalRequestApiError,
  submitRentalRequest,
} from "@/services/rental-request.service"
import type { UserRole } from "@/types/auth"

type RequestToRentActionProps = {
  propertyId: string
  propertyTitle: string
  isAvailable: boolean
  userRole?: UserRole
  defaultOpen?: boolean
  minimumMoveInDate: string
}

function getFieldName(field?: string, path?: string) {
  const value = field ?? path
  if (!value) return null

  const name = value.split(".").at(-1)
  if (
    name === "requestedMoveInDate" ||
    name === "durationInMonths" ||
    name === "tenantMessage"
  ) {
    return name
  }

  return null
}

export function RequestToRentAction({
  propertyId,
  propertyTitle,
  isAvailable,
  userRole,
  defaultOpen = false,
  minimumMoveInDate,
}: RequestToRentActionProps) {
  const router = useRouter()
  const [open, setOpen] = React.useState(defaultOpen && userRole === "TENANT")
  const [submitted, setSubmitted] = React.useState(false)
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RentalRequestFormValues>({
    resolver: zodResolver(rentalRequestSchema),
    defaultValues: {
      requestedMoveInDate: "",
      durationInMonths: 12,
      tenantMessage: "",
    },
  })

  const returnPath = `/properties/${propertyId}?request=1`

  async function onSubmit(values: RentalRequestFormValues) {
    try {
      await submitRentalRequest({
        propertyId,
        requestedMoveInDate: values.requestedMoveInDate,
        durationInMonths: values.durationInMonths,
        tenantMessage: values.tenantMessage || undefined,
      })

      setSubmitted(true)
      setOpen(false)
      reset()
      toast.success("Rental request submitted", {
        description: "The landlord can now review your request.",
      })
    } catch (error) {
      if (error instanceof RentalRequestApiError) {
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
        toast.error("Request could not be submitted", {
          description: error.message,
        })

        if (error.status === 401) {
          router.push(`/auth/login?redirect=${encodeURIComponent(returnPath)}`)
          router.refresh()
        }
      } else {
        const message = "Something went wrong. Please try again."
        setError("root.server", { type: "server", message })
        toast.error(message)
      }
    }
  }

  if (!isAvailable) {
    return (
      <Button className="mt-6 w-full" size="lg" disabled>
        Currently unavailable
      </Button>
    )
  }

  if (!userRole) {
    return (
      <Button className="mt-6 w-full" size="lg" asChild>
        <Link href={`/auth/login?redirect=${encodeURIComponent(returnPath)}`}>
          Sign in to request
        </Link>
      </Button>
    )
  }

  if (userRole !== "TENANT") {
    return (
      <div className="mt-6 space-y-2">
        <Button className="w-full" size="lg" disabled>
          Tenant account required
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Landlord and admin accounts cannot submit rental requests.
        </p>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-6 w-full" size="lg" disabled={submitted}>
          {submitted ? (
            <>
              <CheckCircle2 /> Request submitted
            </>
          ) : (
            "Request to rent"
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request to rent</DialogTitle>
          <DialogDescription>
            Send your preferred move-in details for {propertyTitle}. The
            landlord must approve the request before payment.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
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

          <div>
            <label htmlFor="move-in-date" className="text-sm font-medium">
              Preferred move-in date
            </label>
            <div className="relative mt-2">
              <CalendarDays className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="move-in-date"
                type="date"
                min={minimumMoveInDate}
                className="pl-9"
                aria-invalid={Boolean(errors.requestedMoveInDate)}
                {...register("requestedMoveInDate")}
              />
            </div>
            {errors.requestedMoveInDate?.message && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.requestedMoveInDate.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="rental-duration" className="text-sm font-medium">
              Rental duration (months)
            </label>
            <Input
              id="rental-duration"
              type="number"
              min={1}
              max={36}
              className="mt-2"
              aria-invalid={Boolean(errors.durationInMonths)}
              {...register("durationInMonths", { valueAsNumber: true })}
            />
            {errors.durationInMonths?.message && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.durationInMonths.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="tenant-message" className="text-sm font-medium">
              Message to landlord{" "}
              <span className="text-muted-foreground">(optional)</span>
            </label>
            <Textarea
              id="tenant-message"
              className="mt-2"
              placeholder="Introduce yourself or share any important details..."
              aria-invalid={Boolean(errors.tenantMessage)}
              {...register("tenantMessage")}
            />
            {errors.tenantMessage?.message && (
              <p className="mt-1.5 text-xs text-destructive">
                {errors.tenantMessage.message}
              </p>
            )}
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
                  <LoaderCircle className="animate-spin" /> Sending request...
                </>
              ) : (
                "Submit request"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
