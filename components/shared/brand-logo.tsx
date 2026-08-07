import Link from "next/link"
import { House } from "lucide-react"

import { cn } from "@/lib/utils"

type BrandLogoProps = {
  className?: string
  compact?: boolean
}

export function BrandLogo({ className, compact = false }: BrandLogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2 font-semibold tracking-tight",
        className
      )}
      aria-label="RentNest home"
    >
      <span className="flex size-9 items-center justify-center rounded-xl border border-amber-400/30 bg-amber-400/10 text-amber-500 transition-transform group-hover:-rotate-3">
        <House className="size-5" strokeWidth={2.25} />
      </span>
      {!compact && <span className="text-xl">RentNest</span>}
    </Link>
  )
}
