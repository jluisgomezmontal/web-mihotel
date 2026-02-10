import { Bed, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface EmptyStateProps {
  hasFilters: boolean
  onCreateRoom: () => void
}

export function EmptyState({ hasFilters, onCreateRoom }: EmptyStateProps) {
  return (
    <Card className="border-none shadow-md p-16">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
          <Bed className="relative mx-auto h-20 w-20 text-primary/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {hasFilters ? 'No se encontraron habitaciones' : 'No tienes habitaciones registradas'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {hasFilters
              ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
              : 'Comienza agregando habitaciones a tus propiedades para gestionar reservas y disponibilidad'}
          </p>
        </div>
        <Button 
          onClick={onCreateRoom}
          className="group gap-2 hover:shadow-lg transition-all"
          size="lg"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Crear Primera Habitación
        </Button>
      </div>
    </Card>
  )
}
