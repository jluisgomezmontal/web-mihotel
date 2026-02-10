import { Bed, Users, DollarSign, Edit, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { statusColors, getStatusBarColor } from '@/lib/theme-utils'
import { getStatusLabel, getTypeLabel } from "../constants"
import type { RoomCardProps } from "../types"

export function RoomCard({ room, onEdit, onDelete }: RoomCardProps) {
  const getStatusColor = (status: string) => {
    return statusColors.room[status as keyof typeof statusColors.room] || 'bg-muted text-muted-foreground border-border'
  }

  return (
    <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      <div className={`h-1 w-full ${getStatusBarColor(room.status, 'room')}`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Bed className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  {room.nameOrNumber}
                </CardTitle>
                <CardDescription className="text-xs font-medium">
                  {getTypeLabel(room.type)}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className={`text-xs font-semibold ${getStatusColor(room.status)}`}>
              {getStatusLabel(room.status)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Capacidad</span>
            </div>
            <span className="font-semibold text-sm">
              {room.capacity.adults} {room.capacity.adults === 1 ? 'adulto' : 'adultos'}
              {room.capacity.children ? ` + ${room.capacity.children} ${room.capacity.children === 1 ? 'niño' : 'niños'}` : ''}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between py-3 border-t border-b">
          <span className="text-sm text-muted-foreground font-medium">Precio por noche</span>
          <div className="flex items-center gap-1">
            <DollarSign className="h-5 w-5 text-primary" />
            <span className="font-bold text-xl">{room.pricing.basePrice}</span>
            <span className="text-sm text-muted-foreground font-medium">{room.pricing.currency}</span>
          </div>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Amenidades</p>
            <div className="flex flex-wrap gap-1">
              {room.amenities.slice(0, 3).map((amenity, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {amenity}
                </Badge>
              ))}
              {room.amenities.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{room.amenities.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 font-semibold"
            onClick={() => onEdit(room)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <Button 
            variant="outline"
            size="sm" 
            className="flex-1 font-semibold text-red-500 hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(room)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
