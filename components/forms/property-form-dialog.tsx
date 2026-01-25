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
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { Loader2 } from "lucide-react"

interface Property {
  _id?: string
  name: string
  description?: string
  type: string
  address: {
    street: string
    city: string
    state: string
    postalCode?: string
    country: string
  }
  contact?: {
    phone?: string
    email?: string
  }
  timezone: string
  checkInTime: string
  checkOutTime: string
}

interface PropertyFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  property?: Property
}

export function PropertyFormDialog({ open, onOpenChange, onSuccess, property }: PropertyFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const isEditMode = !!property
  
  const getInitialFormData = React.useCallback(() => property ? {
    name: property.name,
    description: property.description || "",
    type: property.type,
    address: {
      street: property.address.street,
      city: property.address.city,
      state: property.address.state,
      postalCode: property.address.postalCode || "",
      country: property.address.country,
    },
    contact: {
      phone: property.contact?.phone || "",
      email: property.contact?.email || "",
    },
    timezone: property.timezone,
    checkInTime: property.checkInTime,
    checkOutTime: property.checkOutTime,
  } : {
    name: "",
    description: "",
    type: "hotel",
    address: {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "México",
    },
    contact: {
      phone: "",
      email: "",
    },
    timezone: "America/Mexico_City",
    checkInTime: "15:00",
    checkOutTime: "12:00",
  }, [property])
  
  const [formData, setFormData] = React.useState(getInitialFormData())

  React.useEffect(() => {
    if (open) {
      setFormData(getInitialFormData())
      setError(null)
    }
  }, [open, getInitialFormData])

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
        ? `${API_BASE_URL}/properties/${property._id}`
        : `${API_BASE_URL}/properties`
      
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
        setError(data.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} la propiedad`)
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} property:`, err)
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Propiedad' : 'Nueva Propiedad'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Actualiza la información de la propiedad'
              : 'Completa la información para registrar una nueva propiedad'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre de la Propiedad *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="Hotel Paradise"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Propiedad *</Label>
              <Select value={formData.type} onValueChange={(value) => updateField('type', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hotel">Hotel</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                  <SelectItem value="posada">Posada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="Descripción de la propiedad..."
                rows={3}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Dirección</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="street">Calle *</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => updateNestedField('address', 'street', e.target.value)}
                    placeholder="Av. Principal 123"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad *</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => updateNestedField('address', 'city', e.target.value)}
                    placeholder="Ciudad de México"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) => updateNestedField('address', 'state', e.target.value)}
                    placeholder="CDMX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal</Label>
                  <Input
                    id="postalCode"
                    value={formData.address.postalCode}
                    onChange={(e) => updateNestedField('address', 'postalCode', e.target.value)}
                    placeholder="01000"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País *</Label>
                  <Input
                    id="country"
                    value={formData.address.country}
                    onChange={(e) => updateNestedField('address', 'country', e.target.value)}
                    placeholder="México"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Contacto</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.contact.phone}
                    onChange={(e) => updateNestedField('contact', 'phone', e.target.value)}
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) => updateNestedField('contact', 'email', e.target.value)}
                    placeholder="contacto@hotel.com"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Horarios</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="checkInTime">Check-in *</Label>
                  <Input
                    id="checkInTime"
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => updateField('checkInTime', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="checkOutTime">Check-out *</Label>
                  <Input
                    id="checkOutTime"
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => updateField('checkOutTime', e.target.value)}
                    required
                  />
                </div>
              </div>
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
              {isEditMode ? 'Actualizar Propiedad' : 'Crear Propiedad'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
