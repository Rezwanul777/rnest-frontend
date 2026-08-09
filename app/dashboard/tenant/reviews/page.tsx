import type { Metadata } from "next"

import { TenantReviewList } from "@/components/dashboard/tenant-review-list"
import { requireRole } from "@/lib/require-role"
import { getTenantReviewAgreements } from "@/services/tenant-rental-agreement.service"

export const metadata: Metadata = {
  title: "My reviews",
}

export default async function TenantReviewsPage() {
  await requireRole("TENANT")
  const agreements = await getTenantReviewAgreements()

  return <TenantReviewList agreements={agreements} />
}
