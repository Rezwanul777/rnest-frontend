"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, LoaderCircle, LockKeyhole, Mail } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { loginSchema, type LoginFormValues } from "@/lib/validations/auth"
import { AuthApiError, login } from "@/services/auth.service"

type LoginFormProps = {
  redirectTo?: string
  registrationComplete?: boolean
}

function safeRedirect(value?: string) {
  return value?.startsWith("/") && !value.startsWith("//")
    ? value
    : "/properties"
}

export function LoginForm({
  redirectTo,
  registrationComplete = false,
}: LoginFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: LoginFormValues) {
    try {
      await login(values)
      router.push(safeRedirect(redirectTo))
      router.refresh()
    } catch (error) {
      if (error instanceof AuthApiError) {
        let hasFieldError = false

        error.fieldErrors.forEach((item) => {
          const field = item.field ?? item.path
          if (field === "email" || field === "password") {
            setError(field, { type: "server", message: item.message })
            hasFieldError = true
          }
        })

        setError("root.server", {
          type: "server",
          message: hasFieldError
            ? "Please correct the highlighted fields."
            : error.message,
        })
      } else {
        setError("root.server", {
          type: "server",
          message: "Something went wrong. Please try again.",
        })
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      {registrationComplete && (
        <div
          className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
          role="status"
        >
          Account created successfully. Sign in to continue.
        </div>
      )}

      {errors.root?.server?.message && (
        <div
          className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {errors.root.server.message}
        </div>
      )}

      <div>
        <label htmlFor="login-email" className="text-sm font-medium">
          Email address
        </label>
        <div className="relative mt-2">
          <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className="h-11 pl-9"
            {...register("email")}
          />
        </div>
        {errors.email?.message && (
          <p id="login-email-error" className="mt-1.5 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label htmlFor="login-password" className="text-sm font-medium">
            Password
          </label>
          <span className="text-xs text-muted-foreground">
            Use your RentNest password
          </span>
        </div>
        <div className="relative mt-2">
          <LockKeyhole className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="login-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="Enter your password"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={
              errors.password ? "login-password-error" : undefined
            }
            className="h-11 px-9"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        {errors.password?.message && (
          <p
            id="login-password-error"
            className="mt-1.5 text-xs text-destructive"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" /> Signing in...
          </>
        ) : (
          "Sign in"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        New to RentNest?{" "}
        <Link
          href="/auth/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  )
}
