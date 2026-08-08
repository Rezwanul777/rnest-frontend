"use client"

import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function LandlordPropertiesError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <Card className="mx-auto max-w-xl bg-card/90">
      <CardContent className="flex flex-col items-center py-12 text-center">
        <span className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-5" />
        </span>
        <h1 className="mt-5 text-xl font-semibold">
          Could not load your properties
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          The server could not retrieve your listings. Please try again.
        </p>
        <Button className="mt-5" onClick={reset}>
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}
