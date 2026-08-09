"use client"

import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function AdminDashboardError({
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
          Could not load platform overview
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          RentNest could not retrieve the latest admin statistics. Please try
          again.
        </p>
        <Button className="mt-5" onClick={reset}>
          Try again
        </Button>
      </CardContent>
    </Card>
  )
}
