"use client"

import React, { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Loader } from "@/components/ui/loader"
import { Loader2, Calendar, AlertCircle } from "lucide-react"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import { AlertDialogCustom } from '@/components/ui/alert-dialog-custom'

interface Reservation {
  _id?: string
  propertyId: string
  roomId: string
  guestId: string
  dates: {
    checkInDate: string
    checkOutDate: string
  }
  guests: {
    adults: number
    children: number
  }
  source?: string
  specialRequests?: string
  notes?: string
}

interface ReservationFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  reservation?: Reservation
  properties?: Array<{ _id: string; name: string }>
  rooms?: Array<{ _id: string; nameOrNumber: string; propertyId: string; pricing?: { basePrice: number } }>
  guests?: Array<{ _id: string; firstName: string; lastName: string; email: string }>
  preselectedGuestId?: string
}

// Zod Schema para validación
const reservationSchema = z.object({
  propertyId: z.string().min(1, 'Debes seleccionar una propiedad'),
  roomId: z.string().min(1, 'Debes seleccionar una habitación'),
  guestId: z.string().min(1, 'Debes seleccionar un huésped'),
  checkInDate: z.string().min(1, 'Debes seleccionar la fecha de check-in'),
  checkOutDate: z.string().min(1, 'Debes seleccionar la fecha de check-out'),
  adults: z.number().min(1, 'Debe haber al menos 1 adulto').max(20, 'Máximo 20 adultos'),
  children: z.number().min(0, 'No puede ser negativo').max(10, 'Máximo 10 niños'),
  source: z.string().optional(),
  specialRequests: z.string().optional(),
  notes: z.string().optional(),
  initialStatus: z.enum(['pending', 'checked_in']).optional(),
}).refine((data) => {
  const checkIn = new Date(data.checkInDate)
  const checkOut = new Date(data.checkOutDate)
  return checkOut > checkIn
}, {
  message: 'La fecha de check-out debe ser posterior a la fecha de check-in',
  path: ['checkOutDate'],
})

type ReservationFormData = z.infer<typeof reservationSchema>

// Componente para mostrar errores de campo
const FieldError = ({ message }: { message?: string }) => {
  if (!message) return null
  return (
    <div className="flex items-center gap-1.5 mt-1.5 text-sm text-destructive">
      <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
      <span>{message}</span>
    </div>
  )
}

export function ReservationFormDialog({ 
  open, 
  onOpenChange, 
  onSuccess, 
  reservation,
  properties = [],
  rooms = [],
  guests = [],
  preselectedGuestId
}: ReservationFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string>>({})
  const [availableRooms, setAvailableRooms] = React.useState<Array<{ _id: string; nameOrNumber: string }>>([])
  const [selectedRoom, setSelectedRoom] = React.useState<any>(null)
  const [guestSearchTerm, setGuestSearchTerm] = React.useState('')
  const [pricingCalculation, setPricingCalculation] = React.useState({
    nights: 0,
    roomRate: 0,
    totalPrice: 0
  })
  const errorRef = useRef<HTMLDivElement>(null)
  const { alertState, hideAlert, showError: showAlertError } = useAlert()
  const isEditMode = !!reservation
  
  const getInitialFormData = React.useCallback(() => reservation ? {
    propertyId: reservation.propertyId,
    roomId: reservation.roomId,
    guestId: reservation.guestId,
    checkInDate: reservation.dates.checkInDate.split('T')[0],
    checkOutDate: reservation.dates.checkOutDate.split('T')[0],
    adults: reservation.guests.adults,
    children: reservation.guests.children,
    source: reservation.source || "direct",
    specialRequests: reservation.specialRequests || "",
    notes: reservation.notes || "",
    initialStatus: "pending" as 'pending' | 'checked_in',
  } : {
    propertyId: properties.length === 1 ? properties[0]._id : "",
    roomId: "",
    guestId: preselectedGuestId || "",
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    adults: 2,
    children: 0,
    source: "direct",
    specialRequests: "",
    notes: "",
    initialStatus: "pending" as 'pending' | 'checked_in',
  }, [reservation, properties, preselectedGuestId])

  const [formData, setFormData] = React.useState(getInitialFormData)

  React.useEffect(() => {
    if (open) {
      setFormData(getInitialFormData())
      setError(null)
      setFieldErrors({})
      setGuestSearchTerm('')
      console.log('📋 Formulario abierto - Datos recibidos:', {
        properties: properties.length,
        rooms: rooms.length,
        guests: guests.length,
        preselectedGuestId
      })
    }
  }, [open, getInitialFormData, properties.length, rooms.length, guests.length, preselectedGuestId])

  React.useEffect(() => {
    if (formData.propertyId) {
      const filtered = rooms.filter(r => {
        const roomPropertyId = typeof r.propertyId === 'object' ? (r.propertyId as any)?._id : r.propertyId
        return roomPropertyId === formData.propertyId
      })
      console.log('✅ Habitaciones filtradas:', filtered.length, 'de', rooms.length)
      setAvailableRooms(filtered)
    } else {
      setAvailableRooms([])
    }
  }, [formData.propertyId, rooms])

  React.useEffect(() => {
    if (formData.roomId) {
      const room = rooms.find(r => r._id === formData.roomId)
      setSelectedRoom(room)
    } else {
      setSelectedRoom(null)
    }
  }, [formData.roomId, rooms])

  React.useEffect(() => {
    if (formData.checkInDate && formData.checkOutDate && selectedRoom) {
      const checkIn = new Date(formData.checkInDate)
      const checkOut = new Date(formData.checkOutDate)
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
      
      if (nights > 0) {
        const roomRate = selectedRoom.pricing?.basePrice || 0
        const totalPrice = roomRate * nights

        setPricingCalculation({
          nights,
          roomRate,
          totalPrice
        })
      } else {
        setPricingCalculation({
          nights: 0,
          roomRate: 0,
          totalPrice: 0
        })
      }
    }
  }, [formData.checkInDate, formData.checkOutDate, selectedRoom])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    setFieldErrors({})

    // ✅ VALIDACIÓN CON ZOD
    try {
      const validatedData = reservationSchema.parse(formData)
      
      // Si la validación pasa, continuar con el envío
      await submitForm(validatedData)
    } catch (error) {
      setIsLoading(false)
      
      if (error instanceof z.ZodError) {
        // Mapear errores de Zod a errores por campo
        const errors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message
          }
        })
        
        setFieldErrors(errors)
        
        // Mostrar resumen de errores
        const errorMessages = Object.values(errors)
        const errorMessage = '⚠️ Por favor corrige los siguientes errores:\n\n' + errorMessages.map(msg => `• ${msg}`).join('\n')
        setError(errorMessage)
        
        setTimeout(() => {
          errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
      
      return
    }
  }

  const submitForm = async (validatedData: ReservationFormData) => {

    const token = AuthService.getToken()
    if (!token) {
      window.location.href = '/auth/login'
      return
    }

    try {

      // Parse dates correctly to avoid timezone issues
      const [checkInYear, checkInMonth, checkInDay] = formData.checkInDate.split('-').map(Number)
      const [checkOutYear, checkOutMonth, checkOutDay] = formData.checkOutDate.split('-').map(Number)
      
      const checkInDate = new Date(checkInYear, checkInMonth - 1, checkInDay, 12, 0, 0)
      const checkOutDate = new Date(checkOutYear, checkOutMonth - 1, checkOutDay, 12, 0, 0)
      
      const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))

      const payload = {
        propertyId: String(formData.propertyId),
        roomId: String(formData.roomId),
        guestId: String(formData.guestId),
        dates: {
          checkInDate: checkInDate.toISOString(),
          checkOutDate: checkOutDate.toISOString(),
        },
        guests: {
          adults: parseInt(formData.adults.toString()),
          children: parseInt(formData.children.toString()),
        },
        pricing: {
          roomRate: pricingCalculation.roomRate,
          nights: pricingCalculation.nights,
          subtotal: pricingCalculation.totalPrice,
          taxes: 0,
          fees: {
            cleaning: 0,
            service: 0,
            extra: 0
          },
          totalPrice: pricingCalculation.totalPrice,
          currency: 'MXN'
        },
        source: formData.source,
        specialRequests: formData.specialRequests || '',
        notes: formData.notes || '',
        status: formData.initialStatus === 'checked_in' ? 'checked_in' : 'pending',
      }

      const url = isEditMode 
        ? `${API_BASE_URL}/reservations/${reservation._id}`
        : `${API_BASE_URL}/reservations`

      const response = await fetch(url, {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        const responseText = await response.text()
        
        let data
        try {
          if (!responseText || responseText.trim() === '') {
            data = { 
              message: 'El servidor no devolvió información del error',
            }
          } else {
            data = JSON.parse(responseText)
          }
        } catch (e) {
          data = { 
            message: 'Error del servidor', 
          }
        }
        
        // El backend ya devuelve mensajes en español con emojis, usarlos directamente
        const errorMessage = data.message || data.error || `Error al ${isEditMode ? 'actualizar' : 'crear'} la reserva`
        
        // Mostrar error con AlertDialog personalizado
        await showAlertError(
          isEditMode ? 'Error al actualizar la reserva' : 'Error al crear la reserva',
          errorMessage
        )
        
        // También mostrar en el formulario y hacer scroll
        setError(errorMessage)
        
        // Auto-scroll al mensaje de error después de un pequeño delay
        setTimeout(() => {
          errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 100)
      }
    } catch (err) {
      const connectionError = '🌐 Error de conexión\n\nNo se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e intenta nuevamente.'
      
      await showAlertError('Error de conexión', connectionError)
      setError(connectionError)
      
      setTimeout(() => {
        errorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 100)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? 'Editar Reserva' : 'Nueva Reserva'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Actualiza los detalles de la reserva' 
              : 'Completa los datos para crear una nueva reserva'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div ref={errorRef} className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="h-5 w-5 text-destructive" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-destructive mb-2">
                    {isEditMode ? 'Error al actualizar la reserva' : 'Error al crear la reserva'}
                  </h3>
                  <div className="text-sm text-destructive/90 whitespace-pre-line leading-relaxed">
                    {error}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="propertyId">Propiedad *</Label>
              {properties.length === 0 ? (
                <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md bg-muted">
                  <Loader size="sm" />
                  <span className="text-sm text-muted-foreground">Cargando propiedades...</span>
                </div>
              ) : (
                <>
                  <Select
                    value={formData.propertyId}
                    onValueChange={(value) => setFormData({ ...formData, propertyId: value, roomId: "" })}
                    disabled={isEditMode}
                  >
                    <SelectTrigger className={fieldErrors.propertyId ? 'border-destructive' : ''}>
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
                  <FieldError message={fieldErrors.propertyId} />
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="roomId">Habitación *</Label>
              {rooms.length === 0 ? (
                <div className="flex items-center gap-2 h-10 px-3 py-2 border rounded-md bg-muted">
                  <Loader size="sm" />
                  <span className="text-sm text-muted-foreground">Cargando habitaciones...</span>
                </div>
              ) : (
                <>
                  <Select
                    value={formData.roomId}
                    onValueChange={(value) => setFormData({ ...formData, roomId: value })}
                    disabled={!formData.propertyId || isEditMode}
                  >
                    <SelectTrigger className={fieldErrors.roomId ? 'border-destructive' : ''}>
                    <SelectValue placeholder={
                      !formData.propertyId 
                        ? "Primero selecciona una propiedad" 
                        : availableRooms.length === 0 
                          ? "No hay habitaciones disponibles"
                          : "Selecciona una habitación"
                    } />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.length > 0 ? (
                      availableRooms.map((room) => (
                        <SelectItem key={room._id} value={room._id}>
                          {room.nameOrNumber}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        {!formData.propertyId ? "Selecciona una propiedad primero" : "No hay habitaciones para esta propiedad"}
                      </div>
                    )}
                  </SelectContent>
                  </Select>
                  <FieldError message={fieldErrors.roomId} />
                </>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestId">Huésped *</Label>
            <Select
              value={formData.guestId}
              onValueChange={(value) => setFormData({ ...formData, guestId: value })}
              disabled={isEditMode}
            >
              <SelectTrigger className={fieldErrors.guestId ? 'border-destructive' : ''}>
                <SelectValue placeholder="Buscar y seleccionar huésped" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 sticky top-0 bg-background border-b">
                  <Input
                    placeholder="Buscar por nombre o email..."
                    value={guestSearchTerm}
                    onChange={(e) => setGuestSearchTerm(e.target.value)}
                    className="h-8"
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="max-h-[200px] overflow-y-auto">
                  {guests
                    .filter((guest) => {
                      const searchLower = guestSearchTerm.toLowerCase()
                      const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase()
                      const email = guest.email?.toLowerCase() || ''
                      return fullName.includes(searchLower) || email.includes(searchLower)
                    })
                    .map((guest) => (
                      <SelectItem key={guest._id} value={guest._id}>
                        {guest.firstName} {guest.lastName} {guest.email && `(${guest.email})`}
                      </SelectItem>
                    ))}
                  {guests.filter((guest) => {
                    const searchLower = guestSearchTerm.toLowerCase()
                    const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase()
                    const email = guest.email?.toLowerCase() || ''
                    return fullName.includes(searchLower) || email.includes(searchLower)
                  }).length === 0 && (
                    <div className="px-2 py-6 text-center text-sm text-muted-foreground">
                      No se encontraron huéspedes
                    </div>
                  )}
                </div>
              </SelectContent>
            </Select>
            <FieldError message={fieldErrors.guestId} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="checkInDate">Fecha de Check-in *</Label>
              <Input
                id="checkInDate"
                type="date"
                value={formData.checkInDate}
                onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                disabled={isEditMode}
                className={fieldErrors.checkInDate ? 'border-destructive' : ''}
              />
              <FieldError message={fieldErrors.checkInDate} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="checkOutDate">Fecha de Check-out *</Label>
              <Input
                id="checkOutDate"
                type="date"
                value={formData.checkOutDate}
                onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                disabled={isEditMode}
                className={fieldErrors.checkOutDate ? 'border-destructive' : ''}
              />
              <FieldError message={fieldErrors.checkOutDate} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="adults">Adultos *</Label>
              <Input
                id="adults"
                type="number"
                min="1"
                max="20"
                value={formData.adults}
                onChange={(e) => setFormData({ ...formData, adults: parseInt(e.target.value) || 1 })}
                className={fieldErrors.adults ? 'border-destructive' : ''}
              />
              <FieldError message={fieldErrors.adults} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="children">Niños</Label>
              <Input
                id="children"
                type="number"
                min="0"
                max="10"
                value={formData.children}
                onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) || 0 })}
                className={fieldErrors.children ? 'border-destructive' : ''}
              />
              <FieldError message={fieldErrors.children} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source">Fuente de Reserva</Label>
              <Select
                value={formData.source}
                onValueChange={(value) => setFormData({ ...formData, source: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="direct">Directo</SelectItem>
                  <SelectItem value="booking_com">Booking.com</SelectItem>
                  <SelectItem value="airbnb">Airbnb</SelectItem>
                  <SelectItem value="expedia">Expedia</SelectItem>
                  <SelectItem value="phone">Teléfono</SelectItem>
                  <SelectItem value="walk_in">Walk-in</SelectItem>
                  <SelectItem value="other">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="initialStatus">Estado Inicial</Label>
              <Select
                value={formData.initialStatus}
                onValueChange={(value: 'pending' | 'checked_in') => setFormData({ ...formData, initialStatus: value })}
                disabled={isEditMode}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">
                    <div className="flex flex-col">
                      <span className="font-medium">Pendiente</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="checked_in">
                    <div className="flex flex-col">
                      <span className="font-medium">Check-in Directo</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {formData.initialStatus === 'checked_in' 
                  ? '✓ La reserva se creará con el huésped ya registrado'
                  : 'La reserva quedará pendiente de confirmación'}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialRequests">Solicitudes Especiales</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Ej: Cama extra, cuna, piso alto..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas Internas</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notas para el personal del hotel..."
              rows={2}
            />
          </div>

          {pricingCalculation.nights > 0 && (
            <div className="border rounded-lg p-4 bg-muted/50 space-y-3">
              <h4 className="font-semibold text-sm">Resumen de Precios</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa por noche:</span>
                  <span className="font-medium">${pricingCalculation.roomRate.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Noches:</span>
                  <span className="font-medium">{pricingCalculation.nights}</span>
                </div>
                <div className="flex justify-between pt-2 border-t">
                  <span className="font-semibold">Total:</span>
                  <span className="font-bold text-lg">${pricingCalculation.totalPrice.toFixed(2)}</span>
                </div>
              </div>
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
              {isEditMode ? 'Actualizar' : 'Crear'} Reserva
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
      <AlertDialogCustom
        open={alertState.open}
        onOpenChange={hideAlert}
        type={alertState.type}
        title={alertState.title}
        description={alertState.description}
        confirmText={alertState.confirmText}
        cancelText={alertState.cancelText}
        onConfirm={alertState.onConfirm}
        onCancel={alertState.onCancel}
        showCancel={alertState.showCancel}
      />
    </Dialog>
  )
}
