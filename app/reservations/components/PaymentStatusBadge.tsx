/**
 * PaymentStatusBadge Component
 * Displays payment status with icon and color coding
 */

import { CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PAYMENT_STATUS_CONFIG } from "../constants"
import type { PaymentStatus } from "../types"

interface PaymentStatusBadgeProps {
  status: PaymentStatus
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const { label, color, bg, border } = PAYMENT_STATUS_CONFIG[status]

  return (
    <Badge className={cn("text-xs font-semibold px-2.5 py-1 border", color, bg, border)}>
      <CreditCard className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  )
}
