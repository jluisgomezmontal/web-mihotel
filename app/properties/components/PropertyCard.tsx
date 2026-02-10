import { useRouter } from "next/navigation"
import { MapPin, Bed, Building2, Edit, Trash2, DollarSign, TrendingUp, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { PROPERTY_TYPE_LABELS, PROPERTY_TYPE_ICONS, getOccupancyColor, getOccupancyBg, getOccupancyBarColor } from "../constants"
import type { PropertyCardProps } from "../types"

export function PropertyCard({ property, onEdit, onDelete }: PropertyCardProps) {
  const router = useRouter()
  
  const totalRooms = property.totalRooms || 0
  const availableRooms = property.availableRooms || 0
  const occupiedRooms = property.occupiedRooms || 0
  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0

  const TypeIcon = PROPERTY_TYPE_ICONS[property.type] || Building2

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="h-1.5 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--dashboard-success)] via-[var(--dashboard-warning)] to-[var(--dashboard-danger)] opacity-20" />
        <div 
          className={cn("h-full transition-all duration-500", getOccupancyBarColor(occupancyRate))}
          style={{ width: `${occupancyRate}%` }}
        />
      </div>
      
      <CardHeader className="pb-3 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-3">
              <div className="relative p-3 bg-gradient-to-br from-[var(--gradient-primary-from)] to-[var(--gradient-primary-to)] rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                <TypeIcon className="h-6 w-6 text-white" />
                <div className="absolute inset-0 bg-white/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">
                  {property.name}
                </CardTitle>
                <CardDescription className="flex items-center gap-1.5 text-xs mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {property.address.city}, {property.address.state}
                </CardDescription>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs font-semibold px-2.5 py-1">
              {PROPERTY_TYPE_LABELS[property.type]}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 relative">
        <div className="aspect-video bg-gradient-to-br from-muted via-muted/80 to-muted/50 rounded-xl flex items-center justify-center relative overflow-hidden group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/5 transition-all duration-500">
          <Building2 className="h-16 w-16 text-muted-foreground/30 group-hover:text-primary/50 group-hover:scale-110 transition-all duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="backdrop-blur-sm bg-background/80 border-primary/20">
              {totalRooms} habitaciones
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-xl space-y-1.5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5">
              <div className="p-1.5 bg-[var(--dashboard-info)]/10 rounded-lg">
                <Bed className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Disponibles</span>
            </div>
            <p className="font-bold text-2xl text-[var(--dashboard-info)]">{availableRooms}</p>
            <p className="text-xs text-muted-foreground">de {totalRooms} total</p>
          </div>
          
          <div className={cn("p-3 rounded-xl space-y-1.5 border hover:shadow-md transition-shadow", getOccupancyBg(occupancyRate))}>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                "p-1.5 rounded-lg",
                occupancyRate >= 80 ? "bg-[var(--dashboard-success)]/10" :
                occupancyRate >= 60 ? "bg-[var(--dashboard-warning)]/10" :
                "bg-[var(--dashboard-danger)]/10"
              )}>
                <TrendingUp className={cn("h-3.5 w-3.5", getOccupancyColor(occupancyRate))} />
              </div>
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Ocupación</span>
            </div>
            <p className={cn("font-bold text-2xl", getOccupancyColor(occupancyRate))}>{occupancyRate}%</p>
            <p className="text-xs text-muted-foreground">{occupiedRooms} ocupadas</p>
          </div>
        </div>

        {property.monthlyRevenue !== undefined && (
          <div className="p-3 bg-gradient-to-r from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[var(--dashboard-success)]/10 rounded-lg">
                  <DollarSign className="h-4 w-4 text-[var(--dashboard-success)]" />
                </div>
                <span className="text-xs font-semibold text-muted-foreground">Ingresos del mes</span>
              </div>
              <span className="font-bold text-lg text-[var(--dashboard-success)]">
                ${property.monthlyRevenue.toLocaleString()}
              </span>
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
              onEdit(property)
            }}
          >
            <Edit className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            Editar
          </Button>
          <Button 
            size="sm" 
            className="flex-1 font-semibold group/btn hover:shadow-lg transition-all"
            onClick={() => router.push(`/properties/${property._id}`)}
          >
            <Building2 className="h-4 w-4 mr-1.5 group-hover/btn:scale-110 transition-transform" />
            Gestionar
            <ArrowRight className="h-3.5 w-3.5 ml-1 opacity-0 -translate-x-2 group-hover/btn:opacity-100 group-hover/btn:translate-x-0 transition-all" />
          </Button>
          <Button 
            variant="outline"
            size="sm"
            className="text-[var(--dashboard-danger)] hover:text-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger-light)] hover:border-[var(--dashboard-danger)]/30 transition-all group/btn"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(property)
            }}
          >
            <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
