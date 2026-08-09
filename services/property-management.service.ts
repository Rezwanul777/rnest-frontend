import type { ApiErrorResponse, ApiResponse } from "@/types/api"
import type {
  CreatePropertyPayload,
  Property,
  UpdatePropertyPayload,
} from "@/types/property"

type PropertyFieldError = {
  field?: string
  path?: string
  message: string
}

export class PropertyManagementApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly fieldErrors: PropertyFieldError[] = []
  ) {
    super(message)
    this.name = "PropertyManagementApiError"
  }
}

function getFieldErrors(payload: ApiErrorResponse | null) {
  return [...(payload?.errorDetails ?? []), ...(payload?.errorSources ?? [])]
    .filter((item) => Boolean(item.message))
    .map((item) => ({
      field:
        "field" in item && typeof item.field === "string"
          ? item.field
          : undefined,
      path: item.path,
      message: item.message as string,
    }))
}

export async function createProperty(payload: CreatePropertyPayload) {
  const response = await fetch("/api/properties", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const result = (await response.json().catch(() => null)) as
    ApiResponse<Property> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = result as ApiErrorResponse | null
    throw new PropertyManagementApiError(
      errorPayload?.message ?? "Unable to create the property.",
      response.status,
      getFieldErrors(errorPayload)
    )
  }

  if (!result || !("data" in result)) {
    throw new PropertyManagementApiError(
      "The server returned an invalid response.",
      502
    )
  }

  return result
}

export async function updateProperty(
  propertyId: string,
  payload: UpdatePropertyPayload
) {
  const response = await fetch(`/api/properties/${propertyId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  const result = (await response.json().catch(() => null)) as
    ApiResponse<Property> | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = result as ApiErrorResponse | null
    throw new PropertyManagementApiError(
      errorPayload?.message ?? "Unable to update the property.",
      response.status,
      getFieldErrors(errorPayload)
    )
  }

  if (!result || !("data" in result)) {
    throw new PropertyManagementApiError(
      "The server returned an invalid response.",
      502
    )
  }

  return result
}

export async function togglePropertyAvailability(propertyId: string) {
  const response = await fetch(`/api/properties/${propertyId}/availability`, {
    method: "PATCH",
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as
    { success: boolean; message: string } | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null
    throw new PropertyManagementApiError(
      errorPayload?.message ?? "Unable to update property availability.",
      response.status
    )
  }

  if (!payload || !("success" in payload)) {
    throw new PropertyManagementApiError(
      "The server returned an invalid response.",
      502
    )
  }

  return payload
}

export async function deleteProperty(propertyId: string) {
  const response = await fetch(`/api/properties/${propertyId}`, {
    method: "DELETE",
    cache: "no-store",
  })

  const payload = (await response.json().catch(() => null)) as
    { success: boolean; message: string } | ApiErrorResponse | null

  if (!response.ok) {
    const errorPayload = payload as ApiErrorResponse | null
    throw new PropertyManagementApiError(
      errorPayload?.message ?? "Unable to delete the property.",
      response.status,
      getFieldErrors(errorPayload)
    )
  }

  if (!payload || !("success" in payload) || !payload.success) {
    throw new PropertyManagementApiError(
      "The server returned an invalid response.",
      502
    )
  }

  return payload
}
