"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle2, CreditCard, ShieldCheck, LoaderCircle, Lock } from "lucide-react"
import { toast } from "sonner"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createPaymentSession, PaymentApiError } from "@/services/payment.service"
import type { RentalRequest } from "@/types/rental-request"

const taka = new Intl.NumberFormat("en-BD")

type TenantPaymentCheckoutProps = {
  request: RentalRequest
  agreementId: string
}

export function TenantPaymentCheckout({
  request,
  agreementId,
}: TenantPaymentCheckoutProps) {
  const router = useRouter()
  const [gateway, setGateway] = React.useState<"STRIPE" | "SSLCOMMERZ">("STRIPE")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const rentAmount = Number(request.property.rent) || 0
  const durationMonths = request.durationInMonths || 1
  const totalAmount = rentAmount * durationMonths

  async function handleCheckout() {
    setIsProcessing(true)
    try {
      const response = await createPaymentSession({
        agreementId,
        paymentGateway: gateway,
      })

      toast.success("Redirecting to checkout...", {
        description: response.message || "Opening payment gateway",
      })

      if (response.checkoutUrl) {
        if (response.checkoutUrl.startsWith("http")) {
          window.location.href = response.checkoutUrl
        } else {
          router.push(response.checkoutUrl)
        }
      } else {
        router.push(`/payment/success?agreementId=${agreementId}`)
      }
    } catch (error) {
      toast.error("Checkout initiation failed", {
        description:
          error instanceof PaymentApiError
            ? error.message
            : "Something went wrong while setting up payment.",
      })
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/dashboard/tenant/requests">
            <ArrowLeft className="mr-2 size-4" /> Back to requests
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Rental Payment Checkout</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Complete your payment to activate the rental agreement for {request.property.title}.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="bg-card/90">
            <CardHeader>
              <CardTitle className="text-lg">Property Details</CardTitle>
              <CardDescription>Approved rental request breakdown.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-3">
                <span className="text-muted-foreground">Property:</span>
                <span className="font-medium text-right">{request.property.title}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-muted-foreground">Location:</span>
                <span>{request.property.location}</span>
              </div>
              <div className="flex justify-between border-b pb-3">
                <span className="text-muted-foreground">Move-in Date:</span>
                <span>{new Date(request.requestedMoveInDate).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Rental Duration:</span>
                <span>{durationMonths} {durationMonths === 1 ? "month" : "months"}</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/90">
            <CardHeader>
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <CardDescription>Select your preferred payment gateway.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <label
                onClick={() => setGateway("STRIPE")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                  gateway === "STRIPE"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-indigo-500" />
                  <div>
                    <p className="font-medium text-sm">Stripe Checkout</p>
                    <p className="text-xs text-muted-foreground">Credit/Debit Cards & International Payment</p>
                  </div>
                </div>
                {gateway === "STRIPE" && <CheckCircle2 className="size-5 text-primary" />}
              </label>

              <label
                onClick={() => setGateway("SSLCOMMERZ")}
                className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                  gateway === "SSLCOMMERZ"
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-amber-500" />
                  <div>
                    <p className="font-medium text-sm">SSLCommerz Gateway</p>
                    <p className="text-xs text-muted-foreground">bKash, Nagad, Rocket & Local Cards</p>
                  </div>
                </div>
                {gateway === "SSLCOMMERZ" && <CheckCircle2 className="size-5 text-primary" />}
              </label>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card className="bg-card/90 sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Monthly Rent:</span>
                <span>৳{taka.format(rentAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Months:</span>
                <span>× {durationMonths}</span>
              </div>
              <div className="border-t pt-3 flex justify-between font-semibold text-base">
                <span>Total Due:</span>
                <span className="text-amber-600 dark:text-amber-400">৳{taka.format(totalAmount)}</span>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-muted/60 p-3 text-xs text-muted-foreground">
                <Lock className="size-4 text-emerald-500 shrink-0" />
                <span>256-bit encrypted secure transaction.</span>
              </div>

              <Button
                className="w-full mt-2"
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <LoaderCircle className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShieldCheck className="mr-2 size-4" /> Pay ৳{taka.format(totalAmount)}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
