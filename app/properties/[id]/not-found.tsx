import Link from "next/link"
import { Home } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function PropertyNotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16">
      <Card className="w-full max-w-lg items-center rounded-3xl p-8 text-center">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-muted">
          <Home className="size-6 text-muted-foreground" />
        </span>
        <h1 className="mt-5 text-2xl font-semibold">Property not found</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          This property is unavailable, has been removed, or the address is
          incorrect.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/properties">Browse available properties</Link>
        </Button>
      </Card>
    </main>
  )
}
