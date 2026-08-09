import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { UserRole } from "@/types/auth"

const roleStyles: Record<UserRole, string> = {
  TENANT: "border-blue-400/25 bg-blue-400/10 text-blue-700 dark:text-blue-300",
  LANDLORD:
    "border-amber-400/25 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  ADMIN:
    "border-violet-400/25 bg-violet-400/10 text-violet-700 dark:text-violet-300",
}

type UserRoleBadgeProps = {
  role: UserRole
  className?: string
}

export function UserRoleBadge({ role, className }: UserRoleBadgeProps) {
  return (
    <Badge variant="outline" className={cn(roleStyles[role], className)}>
      {role.charAt(0) + role.slice(1).toLowerCase()}
    </Badge>
  )
}
