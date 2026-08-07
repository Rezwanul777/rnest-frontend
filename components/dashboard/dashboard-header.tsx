"use client"

import { Menu } from "lucide-react"

import { LogoutButton } from "@/components/auth/logout-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BrandLogo } from "@/components/shared/brand-logo"
import { ThemeToggle } from "@/components/theme-toggle"
import type { AuthUser } from "@/types/auth"

type DashboardHeaderProps = {
  user: AuthUser
  onMenuClick: () => void
  sidebarOpen: boolean
}

export function DashboardHeader({
  user,
  onMenuClick,
  sidebarOpen,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-background/90 backdrop-blur">
      <div className="flex min-h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon-lg"
            className="lg:hidden"
            onClick={onMenuClick}
            aria-label="Open dashboard navigation"
            aria-controls="dashboard-sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu />
          </Button>
          <BrandLogo className="lg:hidden" />
          <Badge variant="outline" className="hidden capitalize sm:inline-flex">
            {user.role.toLowerCase()} dashboard
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden text-right xl:block">
            <p className="text-sm leading-tight font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <ThemeToggle />
          <LogoutButton />
        </div>
      </div>
    </header>
  )
}
