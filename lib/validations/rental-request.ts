import { z } from "zod"

function isTodayOrFuture(value: string) {
  if (!value) return true

  const requestedDate = new Date(`${value}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return !Number.isNaN(requestedDate.getTime()) && requestedDate >= today
}

export const rentalRequestSchema = z.object({
  requestedMoveInDate: z
    .string()
    .min(1, "Select your preferred move-in date")
    .refine(isTodayOrFuture, "Move-in date cannot be in the past"),
  durationInMonths: z
    .number({ error: "Enter the rental duration" })
    .int("Duration must be a whole number")
    .min(1, "Duration must be at least 1 month")
    .max(36, "Duration cannot exceed 36 months"),
  tenantMessage: z
    .string()
    .trim()
    .max(1000, "Message cannot exceed 1000 characters")
    .refine(
      (value) => value.length === 0 || value.length >= 3,
      "Message must be at least 3 characters"
    ),
})

export type RentalRequestFormValues = z.infer<typeof rentalRequestSchema>
