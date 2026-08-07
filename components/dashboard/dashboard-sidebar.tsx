"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  CreditCard,
  FileClock,
  Gauge,
  Home,
  PlusCircle,
  Search,
  Star,
  Users,
  X,
  type LucideIcon,
} from "lucide-react"

import { BrandLogo } from "@/components/shared/brand-logo"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  dashboardNavigationByRole,
  type DashboardNavItem,
} from "@/lib/dashboard-navigation"
import { cn } from "@/lib/utils"
import type { AuthUser } from "@/types/auth"

const navIcons: Record<DashboardNavItem["icon"], LucideIcon> = {
  overview: Gauge,
  requests: FileClock,
  payments: CreditCard,
  reviews: Star,
  properties: Building2,
  "add-property": PlusCircle,
  tenants: Users,
  users: Users,
}

type DashboardSidebarProps = {
  user: AuthUser
  open: boolean
  onClose: () => void
}

function isActiveRoute(pathname: string, href: string, overviewHref: string) {
  if (href === overviewHref) return pathname === href
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function DashboardSidebar({
  user,
  open,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const items = dashboardNavigationByRole[user.role]
  const overviewHref = items[0].href

  return (
    <>
      <button
        type="button"
        aria-label="Close dashboard navigation"
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/55 backdrop-blur-[2px] transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
      />

      <aside
        id="dashboard-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:shadow-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label={`${user.role.toLowerCase()} dashboard navigation`}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-5">
          <BrandLogo />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <X />
          </Button>
        </div>

        <div className="px-4 pt-5">
          <div className="rounded-xl border border-sidebar-border bg-sidebar-accent/60 p-3">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
              <Badge variant="outline" className="capitalize">
                {user.role.toLowerCase()}
              </Badge>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-5">
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
            Workspace
          </p>
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = navIcons[item.icon]
              const active = isActiveRoute(pathname, item.href, overviewHref)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>

        <div className="space-y-1 border-t border-sidebar-border p-4">
          <Link
            href="/properties"
            onClick={onClose}
            className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Search className="size-4" />
            Browse properties
          </Link>
          <Link
            href="/"
            onClick={onClose}
            className="flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <Home className="size-4" />
            Back to home
          </Link>
        </div>
      </aside>
    </>
  )
}
