"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertTriangle, RotateCcw } from "lucide-react"

export default function PropertiesError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg items-center rounded-3xl p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">
          We couldn&apos;t load the properties
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Something interrupted the request. Please try again in a moment.
        </p>
        <Button type="button" className="mt-6" onClick={unstable_retry}>
          <RotateCcw /> Try again
        </Button>
      </Card>
    </main>
  )
}
