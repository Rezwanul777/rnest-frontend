import "server-only"

import { getPaidPaymentSummary } from "@/services/payment-history.service"

export async function getLandlordPaidEarnings() {
  const summary = await getPaidPaymentSummary()
  return summary.totalAmount
}
