import type { PaginationMeta } from "@/types/api"
import type { UserRole } from "@/types/auth"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: UserRole
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type AdminUserListData = {
  meta: PaginationMeta
  users: AdminUser[]
}
