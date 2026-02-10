import { Phone, Mail, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Property, RoomStats } from "../types"

interface PropertyInfoProps {
  property: Property
  roomStats: RoomStats
}

export function PropertyInfo({ property, roomStats }: PropertyInfoProps) {
  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Información de Contacto
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {property.contact?.phone && (
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{property.contact.phone}</span>
              </div>
            )}
            {property.contact?.email && (
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{property.contact.email}</span>
              </div>
            )}
            {!property.contact?.phone && !property.contact?.email && (
              <p className="text-sm text-muted-foreground">No hay información de contacto</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Horarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Check-in:</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{property.checkInTime}</span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Check-out:</span>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{property.checkOutTime}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estadísticas de Habitaciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Total:</span>
              <span className="font-bold text-lg">{roomStats.total}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Disponibles:</span>
              <span className="font-medium text-green-600">{roomStats.available}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Ocupadas:</span>
              <span className="font-medium text-red-600">{roomStats.occupied}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {property.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descripción</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{property.description}</p>
          </CardContent>
        </Card>
      )}

      {property.amenities && property.amenities.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Amenidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {property.amenities.map((amenity, idx) => (
                <Badge key={idx} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  )
}
