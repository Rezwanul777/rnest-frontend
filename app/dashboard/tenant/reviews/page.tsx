import type { Metadata } from "next"

import { TenantReviewList } from "@/components/dashboard/tenant-review-list"
import { requireRole } from "@/lib/require-role"
import { getTenantReviewAgreements } from "@/services/tenant-rental-agreement.service"

export const metadata: Metadata = {
  title: "My reviews",
}

type TenantReviewsPageProps = {
  searchParams: Promise<{ agreementId?: string }>
}

export default async function TenantReviewsPage({
  searchParams,
}: TenantReviewsPageProps) {
  await requireRole("TENANT")
  const { agreementId } = await searchParams
  const agreements = await getTenantReviewAgreements()

  return (
    <TenantReviewList
      agreements={agreements}
      selectedAgreementId={agreementId}
    />
  )
}
