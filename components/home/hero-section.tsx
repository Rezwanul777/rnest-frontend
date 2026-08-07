import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  MapPin,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  WalletCards,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Category, Property } from "@/types/property"

const trustPoints = [
  { label: "Verified listings", icon: ShieldCheck },
  { label: "Secure payments", icon: WalletCards },
  { label: "Real reviews", icon: Star },
]

type HeroSectionProps = {
  categories: Category[]
  featuredProperty: Property | null
  propertyCount: number
}

const taka = new Intl.NumberFormat("en-BD")

export function HeroSection({
  categories,
  featuredProperty,
  propertyCount,
}: HeroSectionProps) {
  const featuredLocation = featuredProperty?.location.split(",")[0]

  return (
    <section className="rentnest-grid relative overflow-hidden border-b">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_20%,rgba(246,184,74,0.12),transparent_32%),radial-gradient(circle_at_80%_35%,rgba(52,211,153,0.07),transparent_25%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:py-24">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.22em] text-amber-600 dark:text-amber-400">
            <Sparkles className="size-4" />
            RENT SMARTER · LIVE BETTER
          </div>
          <h1 className="max-w-2xl text-4xl font-semibold tracking-[-0.045em] text-balance sm:text-5xl lg:text-6xl lg:leading-[1.06]">
            A better way to find your next place.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            Trusted listings, seamless requests, and secure payments—everything
            you need to rent with confidence.
          </p>

          <form
            action="/properties"
            className="mt-8 grid gap-2 rounded-2xl border bg-card/80 p-2 shadow-xl shadow-black/5 backdrop-blur sm:grid-cols-[1.15fr_1fr_1fr_auto]"
          >
            <label className="flex min-h-14 items-center gap-3 rounded-xl px-3 transition-colors hover:bg-muted/60">
              <MapPin className="size-5 text-amber-500" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Location
                </span>
                <input
                  name="location"
                  placeholder="Search Dhaka"
                  className="mt-0.5 w-full bg-transparent text-sm font-medium outline-none placeholder:text-foreground"
                />
              </span>
            </label>

            <label className="flex min-h-14 items-center gap-3 rounded-xl border-t px-3 transition-colors hover:bg-muted/60 sm:border-t-0 sm:border-l">
              <Building2 className="size-5 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Property type
                </span>
                <select
                  name="categoryId"
                  defaultValue=""
                  className="mt-0.5 w-full appearance-none bg-transparent text-sm font-medium outline-none"
                >
                  <option value="" className="bg-background">
                    Any type
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category.id}
                      value={category.id}
                      className="bg-background"
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </label>

            <label className="flex min-h-14 items-center gap-3 rounded-xl border-t px-3 transition-colors hover:bg-muted/60 sm:border-t-0 sm:border-l">
              <WalletCards className="size-5 text-muted-foreground" />
              <span className="min-w-0 flex-1">
                <span className="block text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                  Monthly budget
                </span>
                <select
                  name="maxRent"
                  defaultValue=""
                  className="mt-0.5 w-full appearance-none bg-transparent text-sm font-medium outline-none"
                >
                  <option value="" className="bg-background">
                    Any budget
                  </option>
                  <option value="25000" className="bg-background">
                    Up to ৳25,000
                  </option>
                  <option value="40000" className="bg-background">
                    Up to ৳40,000
                  </option>
                  <option value="60000" className="bg-background">
                    Up to ৳60,000
                  </option>
                </select>
              </span>
              <ChevronDown className="size-4 text-muted-foreground" />
            </label>

            <Button
              type="submit"
              size="icon-lg"
              className="size-14 rounded-xl"
              aria-label="Search properties"
            >
              <Search className="size-5" />
            </Button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {trustPoints.map(({ label, icon: Icon }) => (
              <Badge
                key={label}
                variant="outline"
                className="gap-2 px-3 py-1.5"
              >
                <Icon className="text-emerald-500" />
                {label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="relative mx-auto min-h-[480px] w-full max-w-xl lg:min-h-[520px]">
          <Badge
            variant="outline"
            className="absolute top-1 left-4 z-20 bg-background/90 px-3 py-2 shadow-lg sm:left-10"
          >
            <span className="size-2 rounded-full bg-emerald-400" />
            {propertyCount} {propertyCount === 1 ? "home" : "homes"} available
          </Badge>

          <Card className="absolute top-14 left-0 h-[370px] w-[82%] overflow-hidden rounded-3xl border-amber-400/25 shadow-2xl sm:h-[405px]">
            <Image
              src={featuredProperty?.image ?? "/property-placeholder.svg"}
              alt={featuredProperty?.title ?? "RentNest property"}
              fill
              preload
              sizes="(max-width: 1024px) 82vw, 470px"
              className="object-cover"
              unoptimized={featuredProperty?.image.startsWith("http")}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-24 text-white">
              <p className="text-sm text-white/70">
                {featuredProperty
                  ? `Featured in ${featuredProperty.location}`
                  : "New listings arriving soon"}
              </p>
              <p className="mt-1 text-xl font-semibold">
                {featuredProperty?.title ?? "Find your next rental home"}
              </p>
            </div>
          </Card>

          <Card className="map-grid absolute top-0 right-0 h-52 w-[43%] overflow-hidden rounded-3xl border-amber-400/30 bg-[#0d1b34] p-4 text-white shadow-2xl sm:h-56">
            <div className="relative z-10 flex h-full flex-col items-center justify-center">
              <MapPin className="size-10 fill-amber-400 text-amber-400" />
              <p className="mt-2 text-xs font-semibold tracking-[0.18em]">
                {featuredLocation?.toUpperCase() ?? "RENTNEST"}
              </p>
              <p className="mt-auto self-start text-[10px] text-white/60">
                DHAKA · BD
              </p>
            </div>
          </Card>

          <Card className="absolute right-0 bottom-3 z-10 w-[52%] rounded-3xl border-amber-400/30 bg-card/95 p-5 shadow-2xl backdrop-blur sm:p-6">
            <p className="text-sm text-muted-foreground">From</p>
            <div className="mt-1 flex items-baseline gap-1">
              {featuredProperty ? (
                <>
                  <span className="text-3xl font-semibold tracking-tight">
                    ৳{taka.format(featuredProperty.rent)}
                  </span>
                  <span className="text-xs text-muted-foreground">/month</span>
                </>
              ) : (
                <span className="text-xl font-semibold tracking-tight">
                  Browse available homes
                </span>
              )}
            </div>
            <div className="my-4 border-t" />
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium">
                {featuredProperty?.category.name ?? "Rental marketplace"}
              </span>
              <Badge variant="secondary">
                <CheckCircle2 /> Verified
              </Badge>
            </div>
          </Card>

          <Button
            variant="outline"
            className="absolute bottom-3 left-0 rounded-xl bg-background/80 backdrop-blur"
            asChild
          >
            <Link href="/properties">
              Explore homes <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
