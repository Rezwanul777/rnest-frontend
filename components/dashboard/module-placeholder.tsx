import Link from "next/link"
import { ArrowLeft, Braces } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

type ModulePlaceholderProps = {
  title: string
  dashboardHref: string
}

export function ModulePlaceholder({
  title,
  dashboardHref,
}: ModulePlaceholderProps) {
  return (
    <div className="mx-auto max-w-2xl py-8 lg:py-16">
      <Card className="overflow-hidden bg-card/90">
        <CardContent className="space-y-6 py-8 sm:p-10">
          <span className="flex size-12 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-amber-500">
            <Braces className="size-5" />
          </span>
          <div>
            <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
              Protected module scaffold
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">
              {title}
            </h1>
            <p className="mt-3 leading-7 text-muted-foreground">
              The shared navigation and role protection are ready. This module
              will be connected to its real RentNest backend endpoint in the
              next implementation step—no mock records are being shown.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href={dashboardHref}>
              <ArrowLeft /> Back to overview
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
