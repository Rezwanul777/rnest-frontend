import type { Metadata } from "next"

import { RegisterForm } from "@/components/auth/register-form"
import { Card } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a RentNest tenant or landlord account.",
}

type RegisterPageProps = {
  searchParams: Promise<{
    role?: string | string[]
  }>
}

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function RegisterPage({
  searchParams,
}: RegisterPageProps) {
  const role = first((await searchParams).role)
  const initialRole = role === "LANDLORD" ? "LANDLORD" : "TENANT"

  return (
    <Card className="mx-auto w-full max-w-2xl rounded-3xl border-amber-500/15 bg-card/95 p-6 shadow-2xl backdrop-blur sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
          Join RentNest
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Select how you will use RentNest. You can register as a tenant or
          landlord.
        </p>
      </div>

      <RegisterForm initialRole={initialRole} />
    </Card>
  )
}
