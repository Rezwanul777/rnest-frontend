"use client"

import * as React from "react"

import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar"
import type { AuthUser } from "@/types/auth"

type DashboardShellProps = {
  user: AuthUser
  children: React.ReactNode
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  React.useEffect(() => {
    if (!sidebarOpen) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setSidebarOpen(false)
    }

    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [sidebarOpen])

  return (
    <div className="min-h-screen bg-background">
      <DashboardSidebar
        user={user}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-72">
        <DashboardHeader
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          sidebarOpen={sidebarOpen}
        />
        <main className="rentnest-grid min-h-[calc(100vh-4rem)]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
