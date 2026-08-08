"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { ArrowLeft, ImagePlus, LoaderCircle, Plus, Trash2, Check } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createLandlordProperty,
  updateLandlordProperty,
  PropertyManagementApiError,
} from "@/services/property-management.service"
import type { Category, Property } from "@/types/property"

const DEFAULT_AMENITIES = [
  "WiFi / High-speed Internet",
  "Air Conditioning",
  "Parking Space",
  "Elevator / Lift",
  "Generator Backup",
  "Balcony",
  "Security / CCTV",
  "Furnished",
  "Pet Friendly",
]

const propertySchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(15, "Description must be at least 15 characters"),
  location: z.string().min(3, "Location is required"),
  rent: z.coerce.number().positive("Rent amount must be greater than 0"),
  categoryId: z.string().min(1, "Please select a category"),
  bedrooms: z.coerce.number().optional().nullable(),
  bathrooms: z.coerce.number().optional().nullable(),
  size: z.coerce.number().optional().nullable(),
  isAvailable: z.boolean().default(true),
})

type PropertyFormValues = {
  title: string
  description: string
  location: string
  rent: number
  categoryId: string
  bedrooms?: number | null
  bathrooms?: number | null
  size?: number | null
  isAvailable: boolean
}

type LandlordPropertyFormProps = {
  categories: Category[]
  initialProperty?: Property
}

export function LandlordPropertyForm({
  categories,
  initialProperty,
}: LandlordPropertyFormProps) {
  const router = useRouter()
  const isEditing = Boolean(initialProperty)

  const [imageUrl, setImageUrl] = React.useState("")
  const [images, setImages] = React.useState<string[]>(
    initialProperty?.images && initialProperty.images.length > 0
      ? initialProperty.images
      : initialProperty?.image
        ? [initialProperty.image]
        : []
  )

  const [selectedAmenities, setSelectedAmenities] = React.useState<string[]>(
    initialProperty?.amenities ?? []
  )
  const [customAmenity, setCustomAmenity] = React.useState("")

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<PropertyFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(propertySchema) as any,
    defaultValues: {
      title: initialProperty?.title ?? "",
      description: initialProperty?.description ?? "",
      location: initialProperty?.location ?? "",
      rent: initialProperty?.rent ?? undefined,
      categoryId: initialProperty?.categoryId ?? initialProperty?.category?.id ?? (categories[0]?.id || ""),
      bedrooms: initialProperty?.bedrooms ?? null,
      bathrooms: initialProperty?.bathrooms ?? null,
      size: initialProperty?.size ?? null,
      isAvailable: initialProperty?.isAvailable ?? true,
    },
  })

  function addImage() {
    const trimmed = imageUrl.trim()
    if (!trimmed) return
    if (!trimmed.startsWith("http://") && !trimmed.startsWith("https://") && !trimmed.startsWith("/")) {
      toast.error("Invalid URL", { description: "Image link must start with http://, https://, or /" })
      return
    }
    setImages((prev) => [...prev, trimmed])
    setImageUrl("")
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((item) => item !== amenity)
        : [...prev, amenity]
    )
  }

  function addCustomAmenity() {
    const trimmed = customAmenity.trim()
    if (!trimmed) return
    if (!selectedAmenities.includes(trimmed)) {
      setSelectedAmenities((prev) => [...prev, trimmed])
    }
    setCustomAmenity("")
  }

  async function onSubmit(values: PropertyFormValues) {
    const finalImages = images.length > 0 ? images : ["/property-placeholder.svg"]

    const payload = {
      ...values,
      bedrooms: values.bedrooms ? Number(values.bedrooms) : null,
      bathrooms: values.bathrooms ? Number(values.bathrooms) : null,
      size: values.size ? Number(values.size) : null,
      images: finalImages,
      amenities: selectedAmenities,
    }

    try {
      if (isEditing && initialProperty?.id) {
        await updateLandlordProperty(initialProperty.id, payload)
        toast.success("Listing updated successfully")
      } else {
        await createLandlordProperty(payload)
        toast.success("Property listing created successfully")
      }

      router.push("/dashboard/landlord/properties")
      router.refresh()
    } catch (error) {
      toast.error(isEditing ? "Failed to update property" : "Failed to create property", {
        description:
          error instanceof PropertyManagementApiError
            ? error.message
            : "Please check your form inputs and try again.",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <Button variant="ghost" size="sm" asChild className="mb-2">
            <Link href="/dashboard/landlord/properties">
              <ArrowLeft className="mr-2 size-4" /> Back to properties
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            {isEditing ? "Edit property listing" : "Create new property listing"}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Provide accurate details and photos to showcase your property to prospective tenants.
          </p>
        </div>
      </div>

      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle>Basic Details</CardTitle>
          <CardDescription>Title, location, category, and pricing.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium">Property Title *</label>
            <Input
              {...register("title")}
              placeholder="e.g. Modern 3-Bedroom Luxury Apartment in Gulshan"
            />
            {errors.title && (
              <p className="text-xs text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Category *</label>
            <select
              {...register("categoryId")}
              className="h-10 w-full rounded-lg border bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-destructive">{errors.categoryId.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Monthly Rent (BDT ৳) *</label>
            <Input
              type="number"
              {...register("rent")}
              placeholder="e.g. 35000"
            />
            {errors.rent && (
              <p className="text-xs text-destructive">{errors.rent.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium">Location / Address *</label>
            <Input
              {...register("location")}
              placeholder="e.g. Road 11, Banani, Dhaka"
            />
            {errors.location && (
              <p className="text-xs text-destructive">{errors.location.message}</p>
            )}
          </div>

          <div className="sm:col-span-2 space-y-2">
            <label className="text-sm font-medium">Description *</label>
            <Textarea
              {...register("description")}
              rows={4}
              placeholder="Provide details about the space, room features, neighborhood highlights, and lease terms..."
            />
            {errors.description && (
              <p className="text-xs text-destructive">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle>Specifications & Features</CardTitle>
          <CardDescription>Number of rooms, floor area, and amenities.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">Bedrooms</label>
              <Input
                type="number"
                {...register("bedrooms")}
                placeholder="e.g. 3"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bathrooms</label>
              <Input
                type="number"
                {...register("bathrooms")}
                placeholder="e.g. 2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Size (sq ft)</label>
              <Input
                type="number"
                {...register("size")}
                placeholder="e.g. 1450"
              />
            </div>
          </div>

          <div className="space-y-3 pt-4 border-t">
            <label className="text-sm font-medium">Select Amenities</label>
            <div className="flex flex-wrap gap-2">
              {DEFAULT_AMENITIES.map((amenity) => {
                const isSelected = selectedAmenities.includes(amenity)
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {isSelected && <Check className="size-3.5" />}
                    {amenity}
                  </button>
                )
              })}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Input
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Add custom amenity..."
                className="max-w-xs h-9 text-xs"
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomAmenity}>
                <Plus className="size-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/90">
        <CardHeader>
          <CardTitle>Image Gallery</CardTitle>
          <CardDescription>Add public image URLs for your property listing.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="flex-1"
            />
            <Button type="button" onClick={addImage} variant="secondary">
              <ImagePlus className="mr-2 size-4" /> Add photo
            </Button>
          </div>

          {images.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
              {images.map((url, idx) => (
                <div
                  key={`${url}-${idx}`}
                  className="relative group flex items-center justify-between rounded-lg border bg-muted/30 p-2 text-xs"
                >
                  <span className="truncate max-w-[200px] text-muted-foreground">
                    {url}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="size-7 text-destructive hover:bg-destructive/10"
                    onClick={() => removeImage(idx)}
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No custom image URLs added yet. A placeholder image will be used if left blank.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button variant="outline" asChild disabled={isSubmitting}>
          <Link href="/dashboard/landlord/properties">Cancel</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <LoaderCircle className="mr-2 size-4 animate-spin" />
              {isEditing ? "Saving changes..." : "Creating listing..."}
            </>
          ) : (
            isEditing ? "Save changes" : "Create property"
          )}
        </Button>
      </div>
    </form>
  )
}
