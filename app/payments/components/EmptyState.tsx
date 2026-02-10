import { DollarSign } from "lucide-react"
import { Card } from "@/components/ui/card"

interface EmptyStateProps {
  hasFilters: boolean
}

export function EmptyState({ hasFilters }: EmptyStateProps) {
  return (
    <Card className="border-none shadow-md p-16">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
          <DollarSign className="relative mx-auto h-20 w-20 text-primary/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {hasFilters ? 'No se encontraron pagos' : 'No tienes pagos registrados'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {hasFilters
              ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
              : 'Los pagos se registran automáticamente cuando se procesan transacciones en las reservaciones'}
          </p>
        </div>
      </div>
    </Card>
  )
}
