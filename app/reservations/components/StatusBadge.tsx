/**
 * StatusBadge Component
 * Displays reservation status with icon and color coding
 */

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { RESERVATION_STATUS_CONFIG } from "../constants"
import type { ReservationStatus } from "../types"

interface StatusBadgeProps {
  status: ReservationStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { label, icon: Icon, color, bg, border } = RESERVATION_STATUS_CONFIG[status]

  return (
    <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", color, bg, border)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}
