import { notFound, redirect } from "next/navigation"

import { TenantPaymentCheckout } from "@/components/dashboard/tenant-payment-checkout"
import { requireRole } from "@/lib/require-role"
import { getTenantRentalRequests } from "@/services/tenant-rental-request.service"

type PaymentPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ agreementId?: string }>
}

export default async function TenantPaymentPage({
  params,
  searchParams,
}: PaymentPageProps) {
  await requireRole("TENANT")

  const [{ id }, query] = await Promise.all([params, searchParams])
  const agreementId = query.agreementId

  const { requests } = await getTenantRentalRequests({ limit: 50 }).catch(() => ({ requests: [] }))
  const request = requests.find((item) => item.id === id)

  if (!request) {
    notFound()
  }

  const finalAgreementId = agreementId || request.rentalAgreement?.id

  if (!finalAgreementId) {
    redirect("/dashboard/tenant/requests")
  }

  return (
    <div className="py-6">
      <TenantPaymentCheckout request={request} agreementId={finalAgreementId} />
    </div>
  )
}
