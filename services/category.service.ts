import { apiFetch } from "@/services/api-client"
import type { Category } from "@/types/property"

export async function getCategories(): Promise<Category[]> {
  const response = await apiFetch<Category[]>("/categories", {
    revalidate: 300,
  })

  return response.data
}
