export type UserRole = "TENANT" | "LANDLORD" | "ADMIN"

export type AuthUser = {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export type LoginPayload = {
  email: string
  password: string
}

export type RegisterPayload = {
  name: string
  email: string
  password: string
  role: Exclude<UserRole, "ADMIN">
}

export type FieldError = {
  field?: string
  path?: string
  message: string
}
