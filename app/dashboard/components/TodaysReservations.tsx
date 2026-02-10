import { Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ReservationItem } from "./ReservationItem"

interface TodaysReservationsProps {
  reservations: any[]
  totalReservations: number
}

export function TodaysReservations({ reservations, totalReservations }: TodaysReservationsProps) {
  return (
    <Card className="border-none shadow-md hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Reservas de Hoy
            </CardTitle>
            <CardDescription className="text-sm">
              Check-ins, check-outs y reservas pendientes
            </CardDescription>
          </div>
          <Badge variant="secondary" className="text-sm font-semibold px-3 py-1">
            {reservations.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {reservations.length > 0 ? (
          <>
            <div className="space-y-3">
              {reservations.slice(0, 5).map((reservation: any, index: number) => (
                <ReservationItem
                  key={reservation._id || index}
                  guest={`${reservation.guestId?.firstName || ''} ${reservation.guestId?.lastName || ''}`}
                  room={reservation.roomId?.nameOrNumber || 'N/A'}
                  checkIn={new Date(reservation.dates?.checkInDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  checkOut={new Date(reservation.dates?.checkOutDate).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  status={reservation.status}
                  nights={reservation.dates?.nights || 0}
                  amount={reservation.pricing?.totalPrice || 0}
                />
              ))}
            </div>
            {reservations.length > 5 && (
              <div className="flex items-center justify-center py-3 border-t">
                <Badge variant="outline" className="text-xs">
                  +{reservations.length - 5} reservas más para hoy
                </Badge>
              </div>
            )}
            <div className="pt-2 border-t">
              <Button 
                variant="ghost" 
                className="w-full group hover:bg-primary/5 transition-colors duration-300" 
                onClick={() => window.location.href = '/reservations'}
              >
                <span className="flex items-center gap-2">
                  Ver Todas las Reservas
                  <Badge variant="secondary" className="group-hover:bg-primary/10 transition-colors">
                    {totalReservations}
                  </Badge>
                </span>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl" />
              <Calendar className="relative mx-auto h-16 w-16 text-primary/40" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No hay reservas para hoy</h3>
            <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
              No tienes check-ins o check-outs programados para hoy
            </p>
            <Button 
              onClick={() => window.location.href = '/reservations'}
              className="group"
            >
              <Calendar className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Ver Todas las Reservas
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
