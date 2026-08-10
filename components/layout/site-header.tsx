import Link from "next/link"
import { CircleUserRound, LayoutDashboard, Menu, X } from "lucide-react"

import { LogoutButton } from "@/components/auth/logout-button"
import { UserRoleBadge } from "@/components/dashboard/user-role-badge"
import { BrandLogo } from "@/components/shared/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { getDashboardPath } from "@/lib/roles"
import { getOptionalCurrentUser } from "@/services/session.service"

const navigation = [
  { label: "Discover", href: "/properties" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "For landlords", href: "/#for-landlords" },
]

export async function SiteHeader() {
  const user = await getOptionalCurrentUser()
  const dashboardHref = user ? getDashboardPath(user.role) : null

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandLogo />

        <nav
          className="hidden items-center gap-8 lg:flex"
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />

          {user && dashboardHref ? (
            <>
              <div className="hidden items-center gap-2 rounded-xl border bg-card/70 px-3 py-1.5 xl:flex">
                <CircleUserRound className="size-5 text-muted-foreground" />
                <div className="max-w-36 leading-tight">
                  <p className="truncate text-sm font-medium">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </div>
                <UserRoleBadge role={user.role} />
              </div>

              <Button variant="outline" size="lg" asChild>
                <Link href={dashboardHref}>
                  <LayoutDashboard /> Dashboard
                </Link>
              </Button>
              <LogoutButton size="lg" />
            </>
          ) : (
            <>
              <Button variant="ghost" size="lg" asChild>
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button size="lg" className="rounded-xl" asChild>
                <Link href="/auth/register?role=LANDLORD">
                  List a property
                </Link>
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <details className="group relative">
            <summary className="flex size-9 cursor-pointer list-none items-center justify-center rounded-xl border border-border bg-background/60 [&::-webkit-details-marker]:hidden">
              <Menu className="size-4 group-open:hidden" />
              <X className="hidden size-4 group-open:block" />
              <span className="sr-only">Open navigation</span>
            </summary>
            <nav
              className="absolute top-12 right-0 w-72 rounded-2xl border bg-popover p-3 shadow-2xl"
              aria-label="Mobile navigation"
            >
              <div className="flex flex-col gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded-lg px-3 py-2.5 text-sm hover:bg-muted"
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="my-2 border-t" />

                {user && dashboardHref ? (
                  <>
                    <div className="mb-2 rounded-xl border bg-card/70 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {user.name}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                        <UserRoleBadge role={user.role} />
                      </div>
                    </div>

                    <Button className="justify-start" asChild>
                      <Link href={dashboardHref}>
                        <LayoutDashboard /> Open dashboard
                      </Link>
                    </Button>
                    <LogoutButton
                      variant="ghost"
                      className="justify-start"
                    />
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" asChild>
                      <Link href="/auth/login">Sign in</Link>
                    </Button>
                    <Button className="mt-1" asChild>
                      <Link href="/auth/register?role=LANDLORD">
                        List a property
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </details>
        </div>
      </div>
    </header>
  )
}
