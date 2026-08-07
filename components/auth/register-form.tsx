"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Building2,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  Search,
  UserRound,
} from "lucide-react"
import { useForm, useWatch } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { registerSchema, type RegisterFormValues } from "@/lib/validations/auth"
import { AuthApiError, register as registerUser } from "@/services/auth.service"
import type { RegisterPayload } from "@/types/auth"

type RegistrationRole = RegisterPayload["role"]

type RegisterFormProps = {
  initialRole: RegistrationRole
}

const roles = [
  {
    value: "TENANT" as const,
    label: "I want to rent",
    description: "Browse homes and send rental requests",
    icon: Search,
  },
  {
    value: "LANDLORD" as const,
    label: "I want to list",
    description: "Publish properties and manage tenants",
    icon: Building2,
  },
]

export function RegisterForm({ initialRole }: RegisterFormProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = React.useState(false)
  const {
    register,
    handleSubmit,
    control,
    setError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: initialRole,
    },
  })
  const selectedRole = useWatch({ control, name: "role" })

  async function onSubmit(values: RegisterFormValues) {
    const payload: RegisterPayload = {
      name: values.name,
      email: values.email,
      password: values.password,
      role: values.role,
    }

    try {
      await registerUser(payload)
      router.push("/auth/login?registered=1")
    } catch (error) {
      if (error instanceof AuthApiError) {
        let hasFieldError = false

        error.fieldErrors.forEach((item) => {
          const field = item.field ?? item.path
          if (
            field === "name" ||
            field === "email" ||
            field === "password" ||
            field === "role"
          ) {
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
      {errors.root?.server?.message && (
        <div
          className="rounded-xl border border-destructive/25 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          role="alert"
        >
          {errors.root.server.message}
        </div>
      )}

      <fieldset>
        <legend className="text-sm font-medium">Choose your role</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {roles.map(({ value, label, description, icon: Icon }) => {
            const selected = selectedRole === value

            return (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setValue("role", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  selected
                    ? "border-amber-500/50 bg-amber-500/10"
                    : "bg-background/50 hover:bg-muted"
                }`}
                aria-pressed={selected}
              >
                <Icon
                  className={`size-5 ${selected ? "text-amber-500" : "text-muted-foreground"}`}
                />
                <span className="mt-3 block text-sm font-semibold">
                  {label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {description}
                </span>
              </button>
            )
          })}
        </div>
        {errors.role?.message && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.role.message}
          </p>
        )}
      </fieldset>

      <div>
        <label htmlFor="register-name" className="text-sm font-medium">
          Full name
        </label>
        <div className="relative mt-2">
          <UserRound className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="register-name"
            autoComplete="name"
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
            className="h-11 pl-9"
            {...register("name")}
          />
        </div>
        {errors.name?.message && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="register-email" className="text-sm font-medium">
          Email address
        </label>
        <div className="relative mt-2">
          <Mail className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={Boolean(errors.email)}
            className="h-11 pl-9"
            {...register("email")}
          />
        </div>
        {errors.email?.message && (
          <p className="mt-1.5 text-xs text-destructive">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="register-password" className="text-sm font-medium">
            Password
          </label>
          <div className="relative mt-2">
            <LockKeyhole className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="At least 8 characters"
              aria-invalid={Boolean(errors.password)}
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
            <p className="mt-1.5 text-xs text-destructive">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-confirm-password"
            className="text-sm font-medium"
          >
            Confirm password
          </label>
          <Input
            id="register-confirm-password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Repeat password"
            aria-invalid={Boolean(errors.confirmPassword)}
            className="mt-2 h-11"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p className="mt-1.5 text-xs text-destructive">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="h-11 w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <LoaderCircle className="animate-spin" /> Creating account...
          </>
        ) : (
          "Create account"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
