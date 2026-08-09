import "server-only"

import { getPaidPaymentSummary } from "@/services/payment-history.service"
import { getTenantRentalAgreements } from "@/services/tenant-rental-agreement.service"
import { getTenantRentalRequests } from "@/services/tenant-rental-request.service"

export async function getTenantOverview() {
  const [
    allRequests,
    payableAgreements,
    activeAgreements,
    recent,
    paidSummary,
  ] = await Promise.all([
    getTenantRentalRequests({ limit: 1 }),
    getTenantRentalAgreements({ limit: 1, status: "PENDING_PAYMENT" }),
    getTenantRentalAgreements({ limit: 1, status: "ACTIVE" }),
    getTenantRentalRequests({ limit: 5 }),
    getPaidPaymentSummary(),
  ])

  return {
    totalRequests: allRequests.meta.total,
    approvedRequests: payableAgreements.meta.total,
    activeRentals: activeAgreements.meta.total,
    totalPaid: paidSummary.totalAmount,
    successfulPayments: paidSummary.totalPayments,
    recentRequests: recent.requests,
  }
}
