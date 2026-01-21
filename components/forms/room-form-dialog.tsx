"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthService } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface Room {
  _id?: string
  propertyId: string
  nameOrNumber: string
  type: string
  description?: string
  capacity: {
    adults: number
    children?: number
  }
  pricing: {
    basePrice: number
    currency: string
    extraAdultPrice?: number
    extraChildPrice?: number
  }
  status: string
  amenities?: string[]
}

interface RoomFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  propertyId?: string
  properties?: Array<{ _id: string; name: string }>
  room?: Room
}

export function RoomFormDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  propertyId,
  properties = [],
  room
}: RoomFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const isEditMode = !!room
  
  const getInitialFormData = () => room ? {
    propertyId: room.propertyId,
    nameOrNumber: room.nameOrNumber,
    type: room.type,
    description: room.description || "",
    capacity: {
      adults: room.capacity.adults,
      children: room.capacity.children || 0,
    },
    pricing: {
      basePrice: room.pricing.basePrice,
      currency: room.pricing.currency,
      extraAdultPrice: room.pricing.extraAdultPrice || 0,
      extraChildPrice: room.pricing.extraChildPrice || 0,
    },
    status: room.status,
    amenities: room.amenities || [],
  } : {
    propertyId: propertyId || "",
    nameOrNumber: "",
    type: "room",
    description: "",
    capacity: {
      adults: 2,
      children: 0,
    },
    pricing: {
      basePrice: 0,
      currency: "MXN",
      extraAdultPrice: 0,
      extraChildPrice: 0,
    },
    status: "available",
    amenities: [] as string[],
  }
  
  const [formData, setFormData] = React.useState(getInitialFormData())
  const [amenityInput, setAmenityInput] = React.useState("")

  React.useEffect(() => {
    if (open) {
      setFormData(getInitialFormData())
      setError(null)
      setAmenityInput("")
    }
  }, [open, room, propertyId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const url = isEditMode 
        ? `http://localhost:3000/api/rooms/${room._id}`
        : 'http://localhost:3000/api/rooms'
      
      const method = isEditMode ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(data.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la habitación`)
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} room:`, err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...(prev[parent as keyof typeof prev] as any),
        [field]: value
      }
    }))
  }

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }))
      setAmenityInput("")
    }
  }

  const removeAmenity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Habitación' : 'Nueva Habitación'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Actualiza la información de la habitación'
              : 'Completa la información para registrar una nueva habitación'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {!propertyId && properties.length > 0 && (
              <div className="space-y-2">
                <Label htmlFor="propertyId">Propiedad *</Label>
                <Select 
                  value={formData.propertyId} 
                  onValueChange={(value) => updateField('propertyId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    {properties.map((property) => (
                      <SelectItem key={property._id} value={property._id}>
                        {property.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nameOrNumber">Nombre/Número *</Label>
                <Input
                  id="nameOrNumber"
                  value={formData.nameOrNumber}
                  onChange={(e) => updateField('nameOrNumber', e.target.value)}
                  placeholder="101, Suite Presidencial, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Habitación *</Label>
                <div id="room-type-select" style={{transition: 'none', animation: 'none'}}>
                  <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                    <SelectTrigger className="transition-none" style={{transition: 'none !important', animation: 'none !important', transform: 'none !important'}}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="transition-none" style={{transition: 'none !important', animation: 'none !important'}}>
                      <SelectItem value="room" className="transition-none" style={{transition: 'none !important', animation: 'none !important'}}>Habitación</SelectItem>
                      <SelectItem value="suite" className="transition-none" style={{transition: 'none !important', animation: 'none !important'}}>Suite</SelectItem>
                      <SelectItem value="apartment" className="transition-none" style={{transition: 'none !important', animation: 'none !important'}}>Apartamento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Descripción de la habitación..."
                rows={3}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Capacidad</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adults">Adultos *</Label>
                  <Input
                    id="adults"
                    type="number"
                    min="1"
                    max="20"
                    value={formData.capacity.adults}
                    onChange={(e) => updateNestedField('capacity', 'adults', parseInt(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children">Niños</Label>
                  <Input
                    id="children"
                    type="number"
                    min="0"
                    max="10"
                    value={formData.capacity.children}
                    onChange={(e) => updateNestedField('capacity', 'children', parseInt(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Precios</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="basePrice">Precio Base *</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing.basePrice}
                    onChange={(e) => updateNestedField('pricing', 'basePrice', parseFloat(e.target.value))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <Select 
                    value={formData.pricing.currency} 
                    onValueChange={(value) => updateNestedField('pricing', 'currency', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MXN">MXN</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extraAdultPrice">Precio Adulto Extra</Label>
                  <Input
                    id="extraAdultPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing.extraAdultPrice}
                    onChange={(e) => updateNestedField('pricing', 'extraAdultPrice', parseFloat(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="extraChildPrice">Precio Niño Extra</Label>
                  <Input
                    id="extraChildPrice"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.pricing.extraChildPrice}
                    onChange={(e) => updateNestedField('pricing', 'extraChildPrice', parseFloat(e.target.value))}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Amenidades</h3>
              <div className="flex gap-2 mb-2">
                <Input
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  placeholder="Ej: WiFi, TV, Aire acondicionado..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addAmenity()
                    }
                  }}
                />
                <Button type="button" onClick={addAmenity} variant="outline">
                  Agregar
                </Button>
              </div>
              {formData.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm flex items-center gap-2"
                    >
                      {amenity}
                      <button
                        type="button"
                        onClick={() => removeAmenity(index)}
                        className="hover:text-destructive"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Estado Inicial</Label>
              <Select value={formData.status} onValueChange={(value) => updateField('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Disponible</SelectItem>
                  <SelectItem value="maintenance">Mantenimiento</SelectItem>
                  <SelectItem value="cleaning">Limpieza</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Actualizar Habitación' : 'Crear Habitación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
