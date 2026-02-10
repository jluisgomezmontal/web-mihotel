/**
 * EmptyState Component
 * Displays empty state when no guests are found
 */

import { User, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface EmptyStateProps {
  hasFilters: boolean
  onCreateGuest: () => void
}

export function EmptyState({ hasFilters, onCreateGuest }: EmptyStateProps) {
  return (
    <Card className="border-none shadow-md p-16">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
          <User className="relative mx-auto h-20 w-20 text-primary/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {hasFilters ? 'No se encontraron huéspedes' : 'No tienes huéspedes registrados'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {hasFilters
              ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
              : 'Comienza agregando tu primer huésped para gestionar reservas y construir tu base de clientes'}
          </p>
        </div>
        <Button 
          onClick={onCreateGuest}
          className="group gap-2 hover:shadow-lg transition-all"
          size="lg"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Crear Primer Huésped
        </Button>
      </div>
    </Card>
  )
}
