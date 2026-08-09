import Link from "next/link"
import { ArrowLeft, Building2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function EditLandlordPropertyNotFound() {
  return (
    <Card className="mx-auto max-w-xl bg-card/90">
      <CardContent className="flex flex-col items-center py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <Building2 className="size-5" />
        </span>
        <h1 className="mt-5 text-xl font-semibold">Property not found</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This listing does not exist or does not belong to your landlord
          account.
        </p>
        <Button className="mt-5" variant="outline" asChild>
          <Link href="/dashboard/landlord/properties">
            <ArrowLeft /> Back to my properties
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
