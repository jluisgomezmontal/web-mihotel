import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Property } from "../types"

interface PropertyHeaderProps {
  property: Property
  onEdit: () => void
  onDelete: () => void
}

export function PropertyHeader({ property, onEdit, onDelete }: PropertyHeaderProps) {
  const router = useRouter()

  return (
    <div className="flex items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => router.push('/properties')}
      >
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight">{property.name}</h1>
        <p className="text-muted-foreground flex items-center gap-2 mt-1">
          <MapPin className="h-4 w-4" />
          {property.address.street}, {property.address.city}, {property.address.state}
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" className="gap-2" onClick={onEdit}>
          <Edit className="h-4 w-4" />
          Editar Propiedad
        </Button>
        <Button variant="destructive" className="gap-2" onClick={onDelete}>
          <Trash2 className="h-4 w-4" />
          Eliminar
        </Button>
      </div>
    </div>
  )
}
