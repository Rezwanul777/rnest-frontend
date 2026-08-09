import Link from "next/link"

import { SiteFooter } from "@/components/layout/site-footer"
import { BrandLogo } from "@/components/shared/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"

export default function PaymentLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <BrandLogo />
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" asChild>
              <Link href="/dashboard/tenant">Tenant dashboard</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="rentnest-grid relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(246,184,74,0.13),transparent_28%),radial-gradient(circle_at_76%_72%,rgba(52,211,153,0.09),transparent_24%)]" />
        <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
