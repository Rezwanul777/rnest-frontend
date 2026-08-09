"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ArrowLeft,
  Building2,
  ImagePlus,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react"
import { type FieldPath, useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  createPropertySchema,
  type CreatePropertyFormValues,
} from "@/lib/validations/property"
import {
  createProperty,
  PropertyManagementApiError,
  updateProperty,
} from "@/services/property-management.service"
import type { Category, CreatePropertyPayload } from "@/types/property"

type CreatePropertyFormProps = {
  categories: Category[]
}

export type PropertyFormInitialValues = CreatePropertyFormValues

type PropertyFormProps =
  | {
      mode: "create"
      categories: Category[]
    }
  | {
      mode: "edit"
      categories: Category[]
      propertyId: string
      initialValues: PropertyFormInitialValues
    }

function optionalNumber(value: string) {
  return value === "" ? undefined : Number(value)
}

function FormError({ message }: { message?: string }) {
  if (!message) return null

  return <p className="mt-1.5 text-xs text-destructive">{message}</p>
}

const fieldNames = new Set([
  "title",
  "description",
  "rent",
  "location",
  "categoryId",
  "bedrooms",
  "bathrooms",
  "size",
  "amenitiesText",
])

function PropertyForm(props: PropertyFormProps) {
  const router = useRouter()
  const { categories } = props
  const isEditing = props.mode === "edit"
  const {
    register,
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreatePropertyFormValues>({
    resolver: zodResolver(createPropertySchema),
    defaultValues:
      props.mode === "edit"
        ? props.initialValues
        : {
            title: "",
            description: "",
            location: "",
            categoryId: "",
            amenitiesText: "",
            images: [{ url: "" }],
          },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "images",
  })

  function applyBackendErrors(error: PropertyManagementApiError) {
    let highlightedField = false

    error.fieldErrors.forEach((item) => {
      const source = (item.field ?? item.path ?? "")
        .replace(/^body\./, "")
        .replace(/\[(\d+)\]/g, ".$1")
      const [rootField, imageIndex] = source.split(".")

      if (rootField === "amenities") {
        setError("amenitiesText", {
          type: "server",
          message: item.message,
        })
        highlightedField = true
        return
      }

      if (rootField === "images" && /^\d+$/.test(imageIndex ?? "")) {
        setError(`images.${Number(imageIndex)}.url`, {
          type: "server",
          message: item.message,
        })
        highlightedField = true
        return
      }

      if (fieldNames.has(rootField)) {
        setError(rootField as FieldPath<CreatePropertyFormValues>, {
          type: "server",
          message: item.message,
        })
        highlightedField = true
      }
    })

    setError("root.server", {
      type: "server",
      message: highlightedField
        ? "Please correct the highlighted fields."
        : error.message,
    })
  }

  async function onSubmit(values: CreatePropertyFormValues) {
    clearErrors("root.server")

    const amenities = Array.from(
      new Set(
        values.amenitiesText
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean)
      )
    )
    const payload: CreatePropertyPayload = {
      title: values.title,
      description: values.description,
      rent: values.rent,
      location: values.location,
      categoryId: values.categoryId,
      bedrooms: values.bedrooms,
      bathrooms: values.bathrooms,
      size: values.size,
      amenities: amenities.length ? amenities : undefined,
      images: values.images.map((image) => image.url),
    }

    try {
      const result =
        props.mode === "edit"
          ? await updateProperty(props.propertyId, payload)
          : await createProperty(payload)
      toast.success(isEditing ? "Property updated" : "Property created", {
        description: result.message,
      })
      router.push("/dashboard/landlord/properties")
      router.refresh()
    } catch (error) {
      if (error instanceof PropertyManagementApiError) {
        applyBackendErrors(error)
        toast.error(
          isEditing ? "Could not update property" : "Could not create property",
          {
            description: error.message,
          }
        )
        return
      }

      setError("root.server", {
        type: "server",
        message: "Something went wrong. Please try again.",
      })
      toast.error(
        isEditing ? "Could not update property" : "Could not create property",
        {
          description: "Something went wrong. Please try again.",
        }
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      {errors.root?.server?.message && (
        <div
          className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {errors.root.server.message}
        </div>
      )}

      <Card className="bg-card/90">
        <CardContent className="py-6">
          <div className="flex items-start gap-3 border-b pb-5">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Building2 className="size-5" />
            </span>
            <div>
              <h2 className="font-semibold">Property information</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {isEditing
                  ? "Review and update the details tenants see on this listing."
                  : "Add the main details tenants will use to evaluate your listing."}
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="property-title" className="text-sm font-medium">
                Property title <span className="text-destructive">*</span>
              </label>
              <Input
                id="property-title"
                placeholder="Modern 2 bedroom apartment in Dhanmondi"
                aria-invalid={Boolean(errors.title)}
                className="mt-2 h-11"
                {...register("title")}
              />
              <FormError message={errors.title?.message} />
            </div>

            <div>
              <label
                htmlFor="property-category"
                className="text-sm font-medium"
              >
                Property type <span className="text-destructive">*</span>
              </label>
              <select
                id="property-category"
                aria-invalid={Boolean(errors.categoryId)}
                className="mt-2 h-11 w-full rounded-lg border border-input bg-background/60 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 aria-invalid:border-destructive"
                {...register("categoryId")}
              >
                <option value="">Select a property type</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <FormError message={errors.categoryId?.message} />
              {categories.length === 0 && (
                <p className="mt-1.5 text-xs text-destructive">
                  No categories are available. Ask the admin to add one first.
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="property-location"
                className="text-sm font-medium"
              >
                Location <span className="text-destructive">*</span>
              </label>
              <Input
                id="property-location"
                placeholder="Dhanmondi, Dhaka"
                aria-invalid={Boolean(errors.location)}
                className="mt-2 h-11"
                {...register("location")}
              />
              <FormError message={errors.location?.message} />
            </div>

            <div>
              <label htmlFor="property-rent" className="text-sm font-medium">
                Monthly rent (৳) <span className="text-destructive">*</span>
              </label>
              <Input
                id="property-rent"
                type="number"
                min="1"
                step="1"
                placeholder="35000"
                aria-invalid={Boolean(errors.rent)}
                className="mt-2 h-11"
                {...register("rent", { setValueAs: optionalNumber })}
              />
              <FormError message={errors.rent?.message} />
            </div>

            <div>
              <label htmlFor="property-size" className="text-sm font-medium">
                Size (sq ft)
              </label>
              <Input
                id="property-size"
                type="number"
                min="1"
                step="1"
                placeholder="1200"
                aria-invalid={Boolean(errors.size)}
                className="mt-2 h-11"
                {...register("size", { setValueAs: optionalNumber })}
              />
              <FormError message={errors.size?.message} />
            </div>

            <div>
              <label
                htmlFor="property-bedrooms"
                className="text-sm font-medium"
              >
                Bedrooms
              </label>
              <Input
                id="property-bedrooms"
                type="number"
                min="1"
                step="1"
                placeholder="2"
                aria-invalid={Boolean(errors.bedrooms)}
                className="mt-2 h-11"
                {...register("bedrooms", { setValueAs: optionalNumber })}
              />
              <FormError message={errors.bedrooms?.message} />
            </div>

            <div>
              <label
                htmlFor="property-bathrooms"
                className="text-sm font-medium"
              >
                Bathrooms
              </label>
              <Input
                id="property-bathrooms"
                type="number"
                min="1"
                step="1"
                placeholder="2"
                aria-invalid={Boolean(errors.bathrooms)}
                className="mt-2 h-11"
                {...register("bathrooms", { setValueAs: optionalNumber })}
              />
              <FormError message={errors.bathrooms?.message} />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="property-description"
                className="text-sm font-medium"
              >
                Description <span className="text-destructive">*</span>
              </label>
              <Textarea
                id="property-description"
                placeholder="Describe the rooms, surroundings, rental conditions, and what makes this property special..."
                aria-invalid={Boolean(errors.description)}
                className="mt-2 min-h-36 resize-y"
                {...register("description")}
              />
              <FormError message={errors.description?.message} />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="property-amenities"
                className="text-sm font-medium"
              >
                Amenities
              </label>
              <Input
                id="property-amenities"
                placeholder="WiFi, Parking, Lift, Generator, Security"
                aria-invalid={Boolean(errors.amenitiesText)}
                className="mt-2 h-11"
                {...register("amenitiesText")}
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Separate each amenity with a comma.
              </p>
              <FormError message={errors.amenitiesText?.message} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card/90">
        <CardContent className="py-6">
          <div className="flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ImagePlus className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold">Property images</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Add up to 8 publicly accessible HTTPS image URLs.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => append({ url: "" })}
              disabled={fields.length >= 8}
            >
              <Plus /> Add image
            </Button>
          </div>

          <div className="mt-6 space-y-4">
            {fields.map((field, index) => (
              <div key={field.id}>
                <label
                  htmlFor={`property-image-${index}`}
                  className="text-sm font-medium"
                >
                  Image URL {index + 1}
                  {index === 0 && <span className="text-destructive"> *</span>}
                </label>
                <div className="mt-2 flex gap-2">
                  <Input
                    id={`property-image-${index}`}
                    type="url"
                    placeholder="https://images.example.com/property.jpg"
                    aria-invalid={Boolean(errors.images?.[index]?.url)}
                    className="h-11"
                    {...register(`images.${index}.url`)}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon-lg"
                    className="h-11 w-11 text-destructive"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    aria-label={`Remove image URL ${index + 1}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
                <FormError message={errors.images?.[index]?.url?.message} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" className="h-11" asChild>
          <Link href="/dashboard/landlord/properties">
            <ArrowLeft /> Cancel
          </Link>
        </Button>
        <Button
          type="submit"
          className="h-11"
          disabled={isSubmitting || categories.length === 0}
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="animate-spin" />
              {isEditing ? "Updating property..." : "Creating property..."}
            </>
          ) : (
            <>
              <Save /> {isEditing ? "Save changes" : "Create property"}
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

export function CreatePropertyForm({ categories }: CreatePropertyFormProps) {
  return <PropertyForm mode="create" categories={categories} />
}

type EditPropertyFormProps = {
  categories: Category[]
  propertyId: string
  initialValues: PropertyFormInitialValues
}

export function EditPropertyForm({
  categories,
  propertyId,
  initialValues,
}: EditPropertyFormProps) {
  return (
    <PropertyForm
      mode="edit"
      categories={categories}
      propertyId={propertyId}
      initialValues={initialValues}
    />
  )
}
