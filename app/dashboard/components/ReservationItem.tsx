import { Bed, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { RESERVATION_STATUS_CONFIG } from "../constants"
import type { ReservationItemProps } from "../types"

export function ReservationItem({ guest, room, checkIn, checkOut, status, nights, amount }: ReservationItemProps) {
  const statusConfig = RESERVATION_STATUS_CONFIG[status] || RESERVATION_STATUS_CONFIG.pending
  const StatusIcon = statusConfig.icon

  return (
    <div className="group relative flex items-center justify-between p-4 border rounded-xl hover:shadow-md transition-all duration-300 hover:border-primary/30 bg-card hover:bg-[var(--card-hover)]">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
      
      <div className="relative flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold text-foreground">{guest}</p>
          <Badge variant="secondary" className="text-xs font-medium">
            <Bed className="h-3 w-3 mr-1" />
            {room}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5" />
          <span>{checkIn} - {checkOut}</span>
          <span className="text-xs">•</span>
          <span className="font-medium">{nights} noche{nights !== 1 ? 's' : ''}</span>
        </div>
      </div>
      
      <div className="relative flex items-center gap-4">
        <div className="text-right space-y-1">
          <p className="text-lg font-bold text-foreground">${amount.toLocaleString()}</p>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-medium border",
              statusConfig.color,
              statusConfig.bg,
              statusConfig.border
            )}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </div>
    </div>
  )
}
