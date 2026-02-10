/**
 * EmptyState Component
 * Displays empty state when no reservations are found
 */

import { Calendar, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface EmptyStateProps {
  hasFilters: boolean
  onCreateReservation: () => void
}

export function EmptyState({ hasFilters, onCreateReservation }: EmptyStateProps) {
  return (
    <Card className="border-none shadow-md p-16">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
          <Calendar className="relative mx-auto h-20 w-20 text-primary/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {hasFilters ? 'No se encontraron reservas' : 'No tienes reservas registradas'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {hasFilters
              ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
              : 'Comienza creando tu primera reserva para gestionar check-ins y check-outs de huéspedes'}
          </p>
        </div>
        <Button 
          onClick={onCreateReservation}
          className="group gap-2 hover:shadow-lg transition-all"
          size="lg"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Crear Primera Reserva
        </Button>
      </div>
    </Card>
  )
}
