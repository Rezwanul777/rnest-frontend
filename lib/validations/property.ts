import { z } from "zod"

export const createPropertySchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(150, "Title cannot exceed 150 characters"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters"),
  rent: z
    .number({ error: "Monthly rent is required" })
    .positive("Monthly rent must be greater than 0"),
  location: z
    .string()
    .trim()
    .min(2, "Location must be at least 2 characters")
    .max(100, "Location cannot exceed 100 characters"),
  categoryId: z.uuid("Select a valid property type"),
  bedrooms: z
    .number()
    .int("Bedrooms must be a whole number")
    .positive("Bedrooms must be greater than 0")
    .optional(),
  bathrooms: z
    .number()
    .int("Bathrooms must be a whole number")
    .positive("Bathrooms must be greater than 0")
    .optional(),
  size: z.number().positive("Size must be greater than 0").optional(),
  amenitiesText: z.string().max(500, "Amenities cannot exceed 500 characters"),
  images: z
    .array(
      z.object({
        url: z.url("Enter a valid image URL"),
      })
    )
    .min(1, "Add at least one property image")
    .max(8, "You can add up to 8 images"),
})

export type CreatePropertyFormValues = z.infer<typeof createPropertySchema>
