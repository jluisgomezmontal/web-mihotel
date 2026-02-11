import { useRouter } from "next/navigation"
import { Bed, Building2, Home, Users, DollarSign, Edit, Trash2, ArrowRight, CheckCircle2, Loader2, Wrench } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getStatusConfig, getTypeLabel } from "../constants"
import type { RoomCardProps } from "../types"

export function RoomCard({ room, onEdit, onDelete, onStatusChange }: RoomCardProps) {
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

        {/* Quick Status Change for Cleaning Rooms */}
        {room.status === 'cleaning' && (
          <div className="p-3 bg-gradient-to-r from-[var(--room-cleaning-light)] to-transparent border border-[var(--room-cleaning)]/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--room-cleaning)]/10 rounded-lg">
                  <Loader2 className="h-4 w-4 text-[var(--room-cleaning)] animate-spin" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Habitación en limpieza</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Marca como disponible cuando esté lista</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange?.(room._id, 'available')
                }}
                className="bg-[var(--room-available)] hover:bg-[var(--room-available)]/90 text-white font-semibold shadow-md hover:shadow-lg transition-all group/btn"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                Marcar Disponible
              </Button>
            </div>
          </div>
        )}

        {/* Quick Status Change for Maintenance Rooms */}
        {room.status === 'maintenance' && (
          <div className="p-3 bg-gradient-to-r from-[var(--room-maintenance-light)] to-transparent border border-[var(--room-maintenance)]/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--room-maintenance)]/10 rounded-lg">
                  <Wrench className="h-4 w-4 text-[var(--room-maintenance)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">En mantenimiento</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Marca como disponible cuando termine</p>
                </div>
              </div>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange?.(room._id, 'available')
                }}
                className="bg-[var(--room-available)] hover:bg-[var(--room-available)]/90 text-white font-semibold shadow-md hover:shadow-lg transition-all group/btn"
              >
                <CheckCircle2 className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                Marcar Disponible
              </Button>
            </div>
          </div>
        )}

        {/* Quick Actions for Available Rooms */}
        {room.status === 'available' && (
          <div className="p-3 bg-gradient-to-r from-[var(--room-available-light)] to-transparent border border-[var(--room-available)]/30 rounded-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--room-available)]/10 rounded-lg">
                  <CheckCircle2 className="h-4 w-4 text-[var(--room-available)]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--text-primary)]">Habitación disponible</p>
                  <p className="text-xs text-[var(--text-tertiary)]">Lista para reservar o mantenimiento</p>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  onStatusChange?.(room._id, 'maintenance')
                }}
                className="border-[var(--room-maintenance)] text-[var(--room-maintenance)] hover:bg-[var(--room-maintenance-light)] hover:text-[var(--room-maintenance)] font-semibold transition-all group/btn"
              >
                <Wrench className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
                Enviar a Mantenimiento
              </Button>
            </div>
          </div>
        )}

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
