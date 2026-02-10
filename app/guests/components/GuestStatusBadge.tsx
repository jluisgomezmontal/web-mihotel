/**
 * GuestStatusBadge Component
 * Displays guest status badges (VIP, Blacklisted, Loyalty levels)
 */

import { Star, Ban, Award } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { GUEST_STATUS_CONFIG, getLoyaltyLevel } from "../constants"
import type { Guest } from "../types"

interface GuestStatusBadgeProps {
  guest: Guest
}

export function GuestStatusBadge({ guest }: GuestStatusBadgeProps) {
  const loyaltyLevel = getLoyaltyLevel(guest.totalStays)

  if (guest.vipStatus) {
    const config = GUEST_STATUS_CONFIG.vip
    return (
      <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", config.color, config.bg, config.border)}>
        <Star className="h-3 w-3 fill-current" />
        {config.label}
      </Badge>
    )
  }

  if (guest.blacklisted) {
    const config = GUEST_STATUS_CONFIG.blacklisted
    return (
      <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", config.color, config.bg, config.border)}>
        <Ban className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const config = GUEST_STATUS_CONFIG[loyaltyLevel]
  return (
    <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", config.color, config.bg, config.border)}>
      <Award className="h-3 w-3" />
      {config.label}
    </Badge>
  )
}
