import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RentalRequestStatus } from "@/types/rental-request"

const statusStyles: Record<RentalRequestStatus, string> = {
  PENDING:
    "border-amber-400/25 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  APPROVED:
    "border-blue-400/25 bg-blue-400/10 text-blue-700 dark:text-blue-300",
  REJECTED: "border-red-400/25 bg-red-400/10 text-red-700 dark:text-red-300",
  CANCELLED:
    "border-slate-400/25 bg-slate-400/10 text-slate-600 dark:text-slate-300",
}

type RentalRequestStatusBadgeProps = {
  status: RentalRequestStatus
  className?: string
}

export function RentalRequestStatusBadge({
  status,
  className,
}: RentalRequestStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </Badge>
  )
}
