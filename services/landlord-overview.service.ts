import "server-only"

import { getLandlordPaidEarnings } from "@/services/landlord-payment.service"
import { getLandlordProperties } from "@/services/landlord-property.service"
import { getLandlordRentalRequests } from "@/services/landlord-rental-request.service"

export async function getLandlordOverview() {
  const [
    allProperties,
    availableProperties,
    pendingRequests,
    recent,
    earnings,
  ] = await Promise.all([
    getLandlordProperties({ limit: 1 }),
    getLandlordProperties({ limit: 1, isAvailable: "true" }),
    getLandlordRentalRequests({ limit: 1, status: "PENDING" }),
    getLandlordRentalRequests({ limit: 5 }),
    getLandlordPaidEarnings(),
  ])

  return {
    totalProperties: allProperties.meta.total,
    availableProperties: availableProperties.meta.total,
    pendingRequests: pendingRequests.meta.total,
    confirmedEarnings: earnings,
    recentRequests: recent.requests,
  }
}
