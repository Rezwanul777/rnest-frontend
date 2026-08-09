import "server-only"

import { getPaidPaymentSummary } from "@/services/payment-history.service"
import { getTenantRentalAgreements } from "@/services/tenant-rental-agreement.service"
import { getTenantRentalRequests } from "@/services/tenant-rental-request.service"

export async function getTenantOverview() {
  const [allRequests, approvedRequests, activeAgreements, recent, paidSummary] =
    await Promise.all([
      getTenantRentalRequests({ limit: 1 }),
      getTenantRentalRequests({ limit: 1, status: "APPROVED" }),
      getTenantRentalAgreements({ limit: 1, status: "ACTIVE" }),
      getTenantRentalRequests({ limit: 5 }),
      getPaidPaymentSummary(),
    ])

  return {
    totalRequests: allRequests.meta.total,
    approvedRequests: approvedRequests.meta.total,
    activeRentals: activeAgreements.meta.total,
    totalPaid: paidSummary.totalAmount,
    successfulPayments: paidSummary.totalPayments,
    recentRequests: recent.requests,
  }
}
