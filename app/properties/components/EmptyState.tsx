import { Building2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface EmptyStateProps {
  hasSearch: boolean
  onCreateProperty: () => void
}

export function EmptyState({ hasSearch, onCreateProperty }: EmptyStateProps) {
  return (
    <Card className="border-none shadow-md p-16">
      <div className="text-center space-y-6">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
          <Building2 className="relative mx-auto h-20 w-20 text-primary/40" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold">
            {hasSearch ? 'No se encontraron propiedades' : 'No tienes propiedades registradas'}
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            {hasSearch 
              ? 'Intenta con otros términos de búsqueda o ajusta los filtros' 
              : 'Comienza agregando tu primera propiedad para gestionar reservas y habitaciones de manera eficiente'}
          </p>
        </div>
        <Button 
          onClick={onCreateProperty}
          className="group gap-2 hover:shadow-lg transition-all"
          size="lg"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
          Crear Primera Propiedad
        </Button>
      </div>
    </Card>
  )
}
