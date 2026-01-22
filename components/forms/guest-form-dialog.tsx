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
import { PhoneInput } from "@/components/ui/phone-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthService } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface Guest {
  _id?: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  dateOfBirth?: string
  nationality?: string
  emergencyContact?: {
    name?: string
    relationship?: string
    phone?: string
  }
  notes?: string
  vipStatus?: boolean
}

interface GuestFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  guest?: Guest
}

export function GuestFormDialog({ open, onOpenChange, onSuccess, guest }: GuestFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const isEditMode = !!guest
  
  const getInitialFormData = React.useCallback(() => guest ? {
    firstName: guest.firstName,
    lastName: guest.lastName,
    email: guest.email || "",
    phone: guest.phone,
    dateOfBirth: guest.dateOfBirth ? new Date(guest.dateOfBirth).toISOString().split('T')[0] : "",
    nationality: guest.nationality || "",
    emergencyContact: {
      name: guest.emergencyContact?.name || "",
      relationship: guest.emergencyContact?.relationship || "",
      phone: guest.emergencyContact?.phone || "",
    },
    notes: guest.notes || "",
    vipStatus: guest.vipStatus || false,
  } : {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    nationality: "Mexicana",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    notes: "",
    vipStatus: false,
  }, [guest])
  
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
        ? `http://localhost:3000/api/guests/${guest._id}`
        : 'http://localhost:3000/api/guests'
      
      const method = isEditMode ? 'PUT' : 'POST'

      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email || undefined,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth || undefined,
        nationality: formData.nationality || undefined,
        emergencyContact: {
          name: formData.emergencyContact.name || undefined,
          relationship: formData.emergencyContact.relationship || undefined,
          phone: formData.emergencyContact.phone || undefined,
        },
        notes: formData.notes || undefined,
        vipStatus: formData.vipStatus,
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(data.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el huésped`)
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} guest:`, err)
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Huésped' : 'Nuevo Huésped'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Actualiza la información del huésped'
              : 'Completa la información para registrar un nuevo huésped'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Información Personal</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField('firstName', e.target.value)}
                    placeholder="Juan"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Pérez"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(value) => updateField('phone', value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Fecha de Nacimiento</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nacionalidad</Label>
                  <Select 
                    value={formData.nationality} 
                    onValueChange={(value) => updateField('nationality', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mexicana">Mexicana</SelectItem>
                      <SelectItem value="Estadounidense">Estadounidense</SelectItem>
                      <SelectItem value="Canadiense">Canadiense</SelectItem>
                      <SelectItem value="Española">Española</SelectItem>
                      <SelectItem value="Colombiana">Colombiana</SelectItem>
                      <SelectItem value="Argentina">Argentina</SelectItem>
                      <SelectItem value="Chilena">Chilena</SelectItem>
                      <SelectItem value="Peruana">Peruana</SelectItem>
                      <SelectItem value="Venezolana">Venezolana</SelectItem>
                      <SelectItem value="Brasileña">Brasileña</SelectItem>
                      <SelectItem value="Francesa">Francesa</SelectItem>
                      <SelectItem value="Alemana">Alemana</SelectItem>
                      <SelectItem value="Italiana">Italiana</SelectItem>
                      <SelectItem value="Británica">Británica</SelectItem>
                      <SelectItem value="Japonesa">Japonesa</SelectItem>
                      <SelectItem value="China">China</SelectItem>
                      <SelectItem value="Otra">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Contacto de Emergencia</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyName">Nombre</Label>
                  <Input
                    id="emergencyName"
                    value={formData.emergencyContact.name}
                    onChange={(e) => updateNestedField('emergencyContact', 'name', e.target.value)}
                    placeholder="María Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emergencyRelationship">Relación</Label>
                  <Select 
                    value={formData.emergencyContact.relationship} 
                    onValueChange={(value) => updateNestedField('emergencyContact', 'relationship', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="spouse">Esposo/a</SelectItem>
                      <SelectItem value="parent">Padre/Madre</SelectItem>
                      <SelectItem value="sibling">Hermano/a</SelectItem>
                      <SelectItem value="child">Hijo/a</SelectItem>
                      <SelectItem value="friend">Amigo/a</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="emergencyPhone">Teléfono</Label>
                  <PhoneInput
                    id="emergencyPhone"
                    value={formData.emergencyContact.phone}
                    onChange={(value) => updateNestedField('emergencyContact', 'phone', value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notas Adicionales</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField('notes', e.target.value)}
                placeholder="Información adicional sobre el huésped..."
                rows={3}
              />
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
              {isEditMode ? 'Actualizar Huésped' : 'Crear Huésped'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
