import Link from "next/link"
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CreditCard,
  FileClock,
  HousePlus,
  Search,
  ShieldCheck,
  Star,
  UserRoundCheck,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

type JourneyStep = {
  title: string
  description: string
  icon: LucideIcon
}

const tenantSteps: JourneyStep[] = [
  {
    title: "Browse and filter homes",
    description:
      "Compare available properties by location, rent, category, and amenities.",
    icon: Search,
  },
  {
    title: "Send a rental request",
    description:
      "Choose a move-in date and duration, then track the request from your dashboard.",
    icon: FileClock,
  },
  {
    title: "Pay only after approval",
    description:
      "When the landlord approves, continue to secure Stripe Checkout from RentNest.",
    icon: CreditCard,
  },
  {
    title: "Move in and share feedback",
    description:
      "Follow the active rental and leave one verified review after successful payment.",
    icon: Star,
  },
]

const landlordSteps: JourneyStep[] = [
  {
    title: "Publish a complete listing",
    description:
      "Add rent, location, amenities, availability, and property images in one form.",
    icon: HousePlus,
  },
  {
    title: "Receive tenant requests",
    description:
      "See incoming requests together with tenant, property, and move-in details.",
    icon: Users,
  },
  {
    title: "Approve or reject quickly",
    description:
      "Update a request with optimistic feedback while the backend remains authoritative.",
    icon: BadgeCheck,
  },
  {
    title: "Manage rentals and earnings",
    description:
      "Track active tenants, property availability, and webhook-confirmed payments.",
    icon: Building2,
  },
]

const safeguards = [
  {
    title: "Role-protected dashboards",
    description: "Tenant, landlord, and admin access stays separated.",
    icon: ShieldCheck,
  },
  {
    title: "Secure Stripe payment",
    description: "The backend webhook confirms every successful checkout.",
    icon: CreditCard,
  },
  {
    title: "Admin moderation",
    description: "Users, listings, requests, and payments remain reviewable.",
    icon: UserRoundCheck,
  },
]

type JourneyCardProps = {
  label: string
  title: string
  description: string
  steps: JourneyStep[]
  actionLabel: string
  actionHref: string
}

function JourneyCard({
  label,
  title,
  description,
  steps,
  actionLabel,
  actionHref,
}: JourneyCardProps) {
  return (
    <Card className="overflow-hidden rounded-3xl border-border/80 bg-card/90 p-0 shadow-xl shadow-black/5">
      <div className="border-b bg-muted/35 px-5 py-6 sm:px-7">
        <Badge variant="outline" className="bg-background/70">
          {label}
        </Badge>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      <ol className="divide-y px-5 sm:px-7">
        {steps.map((step, index) => {
          const Icon = step.icon

          return (
            <li
              key={step.title}
              className="grid grid-cols-[auto_1fr] gap-4 py-5"
            >
              <div className="relative">
                <span className="flex size-10 items-center justify-center rounded-xl border border-amber-400/25 bg-amber-400/10 text-amber-600 dark:text-amber-400">
                  <Icon className="size-5" />
                </span>
                <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-background">
                  {index + 1}
                </span>
              </div>
              <div>
                <h4 className="font-medium">{step.title}</h4>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          )
        })}
      </ol>

      <div className="border-t px-5 py-5 sm:px-7">
        <Button variant="outline" className="rounded-xl" asChild>
          <Link href={actionHref}>
            {actionLabel} <ArrowRight />
          </Link>
        </Button>
      </div>
    </Card>
  )
}

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="rentnest-grid scroll-mt-24 border-y bg-muted/20"
      aria-labelledby="how-it-works-heading"
    >
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="outline" className="bg-background/75">
            <ShieldCheck /> Clear from request to review
          </Badge>
          <h2
            id="how-it-works-heading"
            className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            One marketplace, two simple rental journeys.
          </h2>
          <p className="mt-4 text-base leading-7 text-muted-foreground">
            RentNest keeps every tenant and landlord step visible while secure
            backend rules protect approvals, payments, and role permissions.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <JourneyCard
            label="For tenants"
            title="Find, request, pay, and review"
            description="Search real listings and continue to payment only after the property owner approves your request."
            steps={tenantSteps}
            actionLabel="Browse properties"
            actionHref="/properties"
          />
          <JourneyCard
            label="For landlords"
            title="List, decide, and manage"
            description="Publish properties, act on incoming requests, and follow confirmed rental activity from one workspace."
            steps={landlordSteps}
            actionLabel="Start listing"
            actionHref="/auth/register?role=LANDLORD"
          />
        </div>

        <div className="mt-6 grid overflow-hidden rounded-2xl border bg-background/75 md:grid-cols-3 md:divide-x">
          {safeguards.map(({ title, description, icon: Icon }) => (
            <div
              key={title}
              className="flex gap-3 border-b p-5 last:border-b-0 md:border-b-0"
            >
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Icon className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-medium">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
