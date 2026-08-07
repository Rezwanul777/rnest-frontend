"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { LoaderCircle, LogOut } from "lucide-react"

import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const router = useRouter()
  const [isPending, startTransition] = React.useTransition()

  function handleLogout() {
    startTransition(async () => {
      await fetch("/api/auth/logout", {
        method: "POST",
        cache: "no-store",
      })

      router.replace("/")
      router.refresh()
    })
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleLogout}
      disabled={isPending}
    >
      {isPending ? <LoaderCircle className="animate-spin" /> : <LogOut />}
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  )
}
