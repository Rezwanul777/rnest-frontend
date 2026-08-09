import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { RentalAgreementStatus } from "@/types/rental-request"

const statusStyles: Record<RentalAgreementStatus, string> = {
  PENDING_PAYMENT:
    "border-amber-400/25 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  ACTIVE:
    "border-emerald-400/25 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
  COMPLETED:
    "border-slate-400/25 bg-slate-400/10 text-slate-600 dark:text-slate-300",
  TERMINATED: "border-red-400/25 bg-red-400/10 text-red-700 dark:text-red-300",
  CANCELLED: "border-red-400/25 bg-red-400/10 text-red-700 dark:text-red-300",
}

const statusLabels: Record<RentalAgreementStatus, string> = {
  PENDING_PAYMENT: "Pending payment",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  TERMINATED: "Terminated",
  CANCELLED: "Cancelled",
}

type RentalAgreementStatusBadgeProps = {
  status: RentalAgreementStatus
  className?: string
}

export function RentalAgreementStatusBadge({
  status,
  className,
}: RentalAgreementStatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {statusLabels[status]}
    </Badge>
  )
}
