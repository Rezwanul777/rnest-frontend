import "server-only"

import { getAdminProperties } from "@/services/admin-property.service"
import { getAdminRentalRequests } from "@/services/admin-rental-request.service"
import { getAdminUsers } from "@/services/admin-user.service"
import { getPaidPaymentSummary } from "@/services/payment-history.service"

export async function getAdminOverview() {
  const [recentUsers, allProperties, pendingRequests, recentRequests, revenue] =
    await Promise.all([
      getAdminUsers({ limit: 5 }),
      getAdminProperties({ limit: 1 }),
      getAdminRentalRequests({ limit: 1, status: "PENDING" }),
      getAdminRentalRequests({ limit: 5 }),
      getPaidPaymentSummary(),
    ])

  return {
    totalUsers: recentUsers.meta.total,
    totalProperties: allProperties.meta.total,
    pendingRequests: pendingRequests.meta.total,
    confirmedRevenue: revenue.totalAmount,
    successfulPayments: revenue.totalPayments,
    recentUsers: recentUsers.users,
    recentRequests: recentRequests.requests,
  }
}
