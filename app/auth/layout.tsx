import Link from "next/link"
import { CheckCircle2, ShieldCheck, Sparkles } from "lucide-react"

import { SiteHeader } from "@/components/layout/site-header"
import { Badge } from "@/components/ui/badge"

const benefits = [
  "Request available rental properties",
  "Manage listings from one dashboard",
  "Continue to secure Stripe payment",
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="rentnest-grid relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_24%,rgba(246,184,74,0.12),transparent_28%),radial-gradient(circle_at_82%_64%,rgba(52,211,153,0.08),transparent_26%)]" />
        <div className="relative mx-auto grid min-h-[calc(100vh-4.5rem)] max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
          <section className="hidden lg:block">
            <Badge variant="outline" className="bg-background/70">
              <Sparkles /> One account, every rental step
            </Badge>
            <h1 className="mt-6 max-w-lg text-5xl font-semibold tracking-[-0.045em]">
              Your RentNest journey starts here.
            </h1>
            <p className="mt-5 max-w-lg leading-7 text-muted-foreground">
              Find a verified home as a tenant or publish and manage rental
              properties as a landlord.
            </p>
            <div className="mt-8 space-y-4">
              {benefits.map((benefit) => (
                <p key={benefit} className="flex items-center gap-3 text-sm">
                  <CheckCircle2 className="size-5 text-emerald-500" />
                  {benefit}
                </p>
              ))}
            </div>
            {/* <div className="mt-10 flex items-start gap-3 rounded-2xl border bg-card/70 p-4 backdrop-blur">
              <ShieldCheck className="mt-0.5 size-5 text-amber-500" />
              <p className="max-w-md text-sm leading-6 text-muted-foreground">
                Your authentication token is stored in an HttpOnly cookie and is
                not exposed to browser JavaScript.
              </p>
            </div> */}
          </section>

          <section>{children}</section>
        </div>
      </main>
      <p className="sr-only">
        <Link href="/">Return to RentNest</Link>
      </p>
    </div>
  )
}
