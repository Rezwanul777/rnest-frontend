import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { PaymentStatus } from "@/types/payment"

const statusStyles: Record<PaymentStatus, string> = {
  PENDING:
    "border-amber-400/25 bg-amber-400/10 text-amber-700 dark:text-amber-300",
  PROCESSING:
    "border-blue-400/25 bg-blue-400/10 text-blue-700 dark:text-blue-300",
  PAID: "border-emerald-400/25 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
  FAILED: "border-red-400/25 bg-red-400/10 text-red-700 dark:text-red-300",
  REFUNDED:
    "border-violet-400/25 bg-violet-400/10 text-violet-700 dark:text-violet-300",
  CANCELLED:
    "border-slate-400/25 bg-slate-400/10 text-slate-600 dark:text-slate-300",
}

type PaymentStatusBadgeProps = {
  status: PaymentStatus
  className?: string
}

export function PaymentStatusBadge({
  status,
  className,
}: PaymentStatusBadgeProps) {
  const label = status.charAt(0) + status.slice(1).toLowerCase()

  return (
    <Badge variant="outline" className={cn(statusStyles[status], className)}>
      {label}
    </Badge>
  )
}
