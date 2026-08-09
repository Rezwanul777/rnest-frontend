import { z } from "zod"

export const reviewSchema = z.object({
  rating: z
    .number({ error: "Choose a rating" })
    .int("Rating must be a whole number")
    .min(1, "Choose at least 1 star")
    .max(5, "Rating cannot exceed 5 stars"),
  comment: z.string().trim().max(1000, "Comment cannot exceed 1000 characters"),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>
