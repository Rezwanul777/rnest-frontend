import Link from "next/link"
import { ArrowRight, HousePlus } from "lucide-react"

import { Button } from "@/components/ui/button"

export function OwnerCta() {
  return (
    <section
      id="for-landlords"
      className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8"
    >
      <div className="cta-contours relative overflow-hidden rounded-3xl border border-amber-500/25 bg-[#211707] px-6 py-10 text-white sm:px-10 lg:flex lg:items-center lg:justify-between">
        <div className="relative flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl border border-amber-400/25 bg-amber-400/10 text-amber-400">
            <HousePlus className="size-6" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Own a place? Reach verified tenants.
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65 sm:text-base">
              Create your listing, manage rental requests, and receive secure
              payments from one dashboard.
            </p>
          </div>
        </div>
        <Button className="relative mt-7 rounded-xl lg:mt-0" size="lg" asChild>
          <Link href="/auth/register?role=LANDLORD">
            Start listing <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  )
}
