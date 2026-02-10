import { useRouter } from "next/navigation"
import { Bed, Building2, Home, Users, DollarSign, Edit, Trash2, ArrowRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getStatusConfig, getTypeLabel } from "../constants"
import type { RoomCardProps } from "../types"

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const router = useRouter()
  const statusConfig = getStatusConfig(room.status)
  const StatusIcon = statusConfig.icon

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className={cn("h-1.5 w-full", statusConfig.barColor)} />
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-[var(--gradient-primary-from)] to-[var(--gradient-primary-to)] rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                <Bed className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                  {room.nameOrNumber}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs mt-0.5">
                  <Building2 className="h-3 w-3" />
                  {room.propertyId.name}
                </CardDescription>
              </div>
            </div>
          </div>
          <Badge 
            variant="outline" 
            className={cn(
              "text-xs font-semibold px-2.5 py-1 border",
              statusConfig.color,
              statusConfig.bg,
              statusConfig.border
            )}
          >
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 relative">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-xl space-y-1.5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-[var(--dashboard-info)]/10 rounded-lg">
                <Home className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Tipo</span>
            </div>
            <p className="font-bold text-sm text-[var(--dashboard-info)]">{getTypeLabel(room.type)}</p>
          </div>
          
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-warning-light)] to-transparent border border-[var(--dashboard-warning)]/20 rounded-xl space-y-1.5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-[var(--dashboard-warning)]/10 rounded-lg">
                <Users className="h-3.5 w-3.5 text-[var(--dashboard-warning)]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-tertiary)]">Capacidad</span>
            </div>
            <p className="font-bold text-sm text-[var(--dashboard-warning)]">
              {room.capacity.adults} {room.capacity.adults === 1 ? 'adulto' : 'adultos'}
              {room.capacity.children ? ` + ${room.capacity.children}` : ''}
            </p>
          </div>
        </div>

        <div className="p-3 bg-gradient-to-r from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-xl hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-[var(--dashboard-success)]/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-[var(--dashboard-success)]" />
              </div>
              <span className="text-xs font-semibold text-[var(--text-secondary)]">Precio base / noche</span>
            </div>
            <span className="font-bold text-lg text-[var(--dashboard-success)]">
              ${room.pricing.basePrice.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline"
            size="sm" 
            className="flex-1 font-semibold group/btn hover:border-primary/50 transition-all"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(room)
            }}
          >
            <Edit className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            Editar
          </Button>
          <Button 
            size="sm" 
            className="flex-1 font-semibold group/btn hover:shadow-lg transition-all"
            onClick={() => router.push(`/properties/${room.propertyId._id}`)}
          >
            Gestionar
            <ArrowRight className="h-3.5 w-3.5 ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="text-[var(--dashboard-danger)] hover:text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger-light)] hover:border-[var(--dashboard-danger)]/30 transition-all group/btn"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(room)
            }}
          >
            <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
