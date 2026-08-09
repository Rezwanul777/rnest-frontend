import Link from "next/link"
import { FileQuestion } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TenantPaymentNotFound() {
  return (
    <Card className="mx-auto max-w-xl items-center bg-card/90 p-8 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <FileQuestion className="size-5" />
      </span>
      <h1 className="mt-5 text-xl font-semibold">Payment is not available</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        This rental agreement was not found in your account, or the payment link
        is incomplete.
      </p>
      <Button className="mt-5" asChild>
        <Link href="/dashboard/tenant/requests">Return to requests</Link>
      </Button>
    </Card>
  )
}
