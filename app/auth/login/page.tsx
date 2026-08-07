import type { Metadata } from "next"

import { LoginForm } from "@/components/auth/login-form"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your RentNest tenant, landlord, or admin account.",
}

type LoginPageProps = {
  searchParams: Promise<{
    redirect?: string | string[]
    registered?: string | string[]
  }>
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const query = await searchParams

  return (
    <Card className="mx-auto w-full max-w-xl rounded-3xl border-amber-500/15 bg-card/95 p-6 shadow-2xl backdrop-blur sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          Welcome back
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Sign in to RentNest
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Continue managing requests, listings, and rental payments.
        </p>
      </div>

      <LoginForm
        redirectTo={first(query.redirect)}
        registrationComplete={first(query.registered) === "1"}
      />
    </Card>
  )
}
