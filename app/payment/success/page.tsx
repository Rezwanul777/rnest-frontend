import type { Metadata } from "next"

import { PaymentSuccessCard } from "@/components/payment/payment-success-card"

export const metadata: Metadata = {
  title: "Payment submitted",
}

type PaymentSuccessPageProps = {
  searchParams: Promise<{ session_id?: string }>
}

export default async function PaymentSuccessPage({
  searchParams,
}: PaymentSuccessPageProps) {
  const { session_id: sessionId } = await searchParams

  return <PaymentSuccessCard sessionId={sessionId} />
}
