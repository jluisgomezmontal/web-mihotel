"use client"

import * as React from "react"
import { Plus, Search, Filter, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, User, Edit, Trash2, MoreVertical, Building2, Bed, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Loader } from "@/components/ui/loader"
import { MainLayout } from "@/components/layout/main-layout"
import { formatCurrency, formatDate } from "@/lib/utils"
import { AuthService } from "@/lib/auth"
import { useAlert } from "@/lib/use-alert"
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { ReservationFormDialog } from "@/components/forms/reservation-form-dialog"
import { PaymentFormDialog } from "@/components/forms/payment-form-dialog"
import { useDashboard } from "@/contexts/DashboardContext"

interface Reservation {
  id: string
  confirmationNumber: string
  guest: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  property: {
    name: string
  }
  room: {
    nameOrNumber: string
    type: string
  }
  dates: {
    checkInDate: string
    checkOutDate: string
    nights: number
  }
  guests: {
    adults: number
    children: number
  }
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  pricing: {
    totalPrice: number
    currency: string
  }
  paymentStatus: 'pending' | 'partial' | 'paid'
  source: string
  createdAt: string
}

function StatusBadge({ status }: { status: Reservation['status'] }) {
  const config = {
    pending: { label: 'Pendiente', variant: 'warning' as const, icon: Clock },
    confirmed: { label: 'Confirmada', variant: 'success' as const, icon: CheckCircle },
    checked_in: { label: 'Check-in', variant: 'info' as const, icon: User },
    checked_out: { label: 'Check-out', variant: 'secondary' as const, icon: CheckCircle },
    cancelled: { label: 'Cancelada', variant: 'destructive' as const, icon: XCircle }
  }

  const { label, variant, icon: Icon } = config[status]

  return (
    <Badge variant={variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

function PaymentStatusBadge({ status }: { status: Reservation['paymentStatus'] }) {
  const config = {
    pending: { label: 'Pendiente', variant: 'warning' as const },
    partial: { label: 'Parcial', variant: 'info' as const },
    paid: { label: 'Pagado', variant: 'success' as const }
  }

  const { label, variant } = config[status]

  return (
    <Badge variant={variant} className="text-xs">
      {label}
    </Badge>
  )
}

interface ReservationCardProps {
  reservation: Reservation
  onEdit: (reservation: any) => void
  onDelete: (id: string) => void
  onConfirm: (id: string) => void
  onCheckIn: (id: string) => void
  onCheckOut: (id: string) => void
  onCancel: (id: string) => void
  onRegisterPayment: (reservationId: string) => void
}

function ReservationCard({
  reservation,
  onEdit,
  onDelete,
  onConfirm,
  onCheckIn,
  onCheckOut,
  onCancel,
  onRegisterPayment,
}: ReservationCardProps) {
  const handleConfirm = () => onConfirm(reservation.id)
  const handleCheckIn = () => onCheckIn(reservation.id)
  const handleCheckOut = () => onCheckOut(reservation.id)
  const handleCancel = () => onCancel(reservation.id)
  
  const hasBalance = reservation.paymentStatus !== 'paid'
  const balanceAmount = reservation.pricing.totalPrice - (reservation.pricing.totalPrice * (reservation.paymentStatus === 'partial' ? 0.5 : reservation.paymentStatus === 'paid' ? 1 : 0))

  return (
    <Card className="group hover:shadow-lg hover:border-primary/20 transition-all duration-300 overflow-hidden">
      {/* Status Indicator Bar */}
      <div className={`h-1 w-full ${
        reservation.status === 'confirmed' ? 'bg-blue-500' :
        reservation.status === 'checked_in' ? 'bg-green-500' :
        reservation.status === 'checked_out' ? 'bg-gray-400' :
        reservation.status === 'cancelled' ? 'bg-red-500' :
        'bg-yellow-500'
      }`} />
      
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Guest Name & Confirmation */}
            <div className="flex items-center gap-2 flex-wrap">
              <CardTitle className="text-lg font-bold">
                {reservation.guest.firstName} {reservation.guest.lastName}
              </CardTitle>
              <Badge variant="outline" className="font-mono text-xs">
                #{reservation.confirmationNumber}
              </Badge>
            </div>
            
            {/* Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={reservation.status} />
              <PaymentStatusBadge status={reservation.paymentStatus} />
            </div>
            
            {/* Property & Room Info */}
            <div className="space-y-1.5 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span className="font-medium text-foreground">{reservation.property.name}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bed className="h-4 w-4" />
                <span className="font-medium text-foreground">{reservation.room.nameOrNumber}</span>
                <Badge variant="secondary" className="text-xs">{reservation.room.type}</Badge>
              </div>
            </div>
          </div>
          
          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 opacity-60 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onEdit(reservation)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar Reserva
              </DropdownMenuItem>
              {reservation.status === 'pending' && (
                <DropdownMenuItem onClick={handleConfirm}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmar Reserva
                </DropdownMenuItem>
              )}
              {['pending', 'confirmed'].includes(reservation.status) && (
                <DropdownMenuItem onClick={handleCancel} className="text-destructive">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar Reserva
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(reservation.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Dates Section */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/50 rounded-lg">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Check-in</p>
            <p className="font-semibold text-sm">{formatDate(reservation.dates.checkInDate)}</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Check-out</p>
            <p className="font-semibold text-sm">{formatDate(reservation.dates.checkOutDate)}</p>
          </div>
        </div>

        {/* Pricing & Guests */}
        <div className="flex justify-between items-center py-3 border-t border-b">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">Huéspedes</p>
            <p className="font-medium text-sm">
              {reservation.guests.adults} adulto{reservation.guests.adults !== 1 ? 's' : ''}
              {reservation.guests.children > 0 && `, ${reservation.guests.children} niño${reservation.guests.children !== 1 ? 's' : ''}`}
            </p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-xs text-muted-foreground">{reservation.dates.nights} noche{reservation.dates.nights !== 1 ? 's' : ''}</p>
            <p className="font-bold text-xl">{formatCurrency(reservation.pricing.totalPrice)}</p>
          </div>
        </div>

        {/* Payment Alert */}
        {hasBalance && (
          <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <CreditCard className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-amber-900 dark:text-amber-100">Saldo pendiente</p>
              <p className="text-sm font-bold text-amber-700 dark:text-amber-400">{formatCurrency(balanceAmount)}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Primary Action Button */}
          {reservation.status === 'confirmed' && (
            <Button size="default" onClick={handleCheckIn} className="w-full font-semibold bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Realizar Check-in
            </Button>
          )}
          {reservation.status === 'checked_in' && (
            <Button size="default" onClick={handleCheckOut} className="w-full font-semibold bg-blue-600 hover:bg-blue-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Realizar Check-out
            </Button>
          )}
          
          {/* Payment Button - Prominent when balance exists */}
          {hasBalance && ['pending', 'confirmed', 'checked_in'].includes(reservation.status) && (
            <Button 
              size="default" 
              onClick={() => onRegisterPayment(reservation.id)}
              variant={reservation.paymentStatus === 'pending' ? 'default' : 'outline'}
              className="w-full font-semibold"
            >
              <CreditCard className="mr-2 h-4 w-4" />
              {reservation.paymentStatus === 'pending' ? 'Registrar Primer Pago' : 'Registrar Pago Adicional'}
            </Button>
          )}
          
          {/* Secondary Actions */}
          {['pending', 'confirmed'].includes(reservation.status) && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(reservation)}
                className="flex-1"
              >
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ReservationsPage() {
  const { reservations, properties, rooms, guests, userData, tenantData, refreshReservations, refreshRooms, refreshGuests, isLoading } = useDashboard()
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingReservation, setEditingReservation] = React.useState<any>(undefined)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = React.useState(false)
  const [selectedReservationForPayment, setSelectedReservationForPayment] = React.useState<string | undefined>(undefined)
  const { alertState, hideAlert, confirmDelete, showError, showLoading, close, showSuccess } = useAlert()

  const handleConfirm = async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Confirmar Reserva?',
      text: 'La reserva pasará de pendiente a confirmada.',
      confirmButtonText: 'Sí, Confirmar',
    })

    if (!confirmed) return

    showLoading('Confirmando reserva...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        close()
        await showSuccess('¡Reserva confirmada!', 'La reserva ha sido confirmada exitosamente')
        refreshReservations()
      } else {
        const data = await response.json()
        close()
        await showError('Error al confirmar', data.message || 'No se pudo confirmar la reserva')
      }
    } catch (err) {
      close()
      console.error('Error confirming reservation:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const handleCheckIn = async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Realizar Check-in?',
      text: 'El huésped será marcado como en el hotel y la habitación como ocupada.',
      confirmButtonText: 'Sí, Check-in',
    })

    if (!confirmed) return

    showLoading('Procesando check-in...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}/checkin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      close()

      if (response.ok) {
        await showSuccess('Check-in realizado', 'El huésped ha sido registrado exitosamente')
        refreshReservations()
      } else {
        const data = await response.json()
        await showError('Error al realizar check-in', data.message || 'No se pudo completar el check-in')
      }
    } catch (err) {
      close()
      console.error('Error during check-in:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const handleCheckOut = async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Realizar Check-out?',
      text: 'El huésped será marcado como salido y la habitación quedará en limpieza.',
      confirmButtonText: 'Sí, Check-out',
    })

    if (!confirmed) return

    showLoading('Procesando check-out...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}/checkout`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      close()

      if (response.ok) {
        await showSuccess('Check-out realizado', 'El huésped ha sido dado de salida exitosamente')
        refreshReservations()
      } else {
        const data = await response.json()
        await showError('Error al realizar check-out', data.message || 'No se pudo completar el check-out')
      }
    } catch (err) {
      close()
      console.error('Error during check-out:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const handleCancel = async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Cancelar reserva?',
      text: 'La reserva será cancelada y la habitación quedará disponible.',
      confirmButtonText: 'Sí, cancelar',
    })

    if (!confirmed) return

    showLoading('Cancelando reserva...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Cancelada por el usuario' })
      })

      close()

      if (response.ok) {
        await showSuccess('Reserva cancelada', 'La reserva ha sido cancelada exitosamente')
        refreshReservations()
      } else {
        const data = await response.json()
        await showError('Error al cancelar', data.message || 'No se pudo cancelar la reserva')
      }
    } catch (err) {
      close()
      console.error('Error cancelling reservation:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }

  const handleDelete = async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar reserva?',
      text: 'Esta acción no se puede deshacer. La reserva será eliminada permanentemente.',
    })

    if (!confirmed) return

    showLoading('Eliminando reserva...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        refreshReservations()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar la reserva')
      }
    } catch (err) {
      close()
      console.error('Error deleting reservation:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }


  const reservationsArray = Array.isArray(reservations) ? reservations : []

  const filteredReservations = reservationsArray.filter((reservation: any) => {
    const guestName = `${reservation.guestId?.firstName || ''} ${reservation.guestId?.lastName || ''}`.toLowerCase()
    const confirmationNumber = reservation.confirmationNumber?.toLowerCase() || ''
    const roomNumber = reservation.roomId?.nameOrNumber?.toLowerCase() || ''

    const matchesSearch =
      guestName.includes(searchTerm.toLowerCase()) ||
      confirmationNumber.includes(searchTerm.toLowerCase()) ||
      roomNumber.includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusCounts = () => {
    return reservationsArray.reduce((acc: any, reservation: any) => {
      acc[reservation.status] = (acc[reservation.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
  }

  const statusCounts = getStatusCounts()

  return (
    <MainLayout
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Reservas</h1>
            <p className="text-muted-foreground">
              Gestiona todas las reservas y procesos de check-in/check-out
            </p>
          </div>

          <Button className="gap-2" onClick={() => {
            setEditingReservation(undefined)
            setIsDialogOpen(true)
          }}>
            <Plus className="h-4 w-4" />
            Nueva Reserva
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por huésped, confirmación o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="pending">Pendiente ({statusCounts.pending || 0})</option>
            <option value="confirmed">Confirmada ({statusCounts.confirmed || 0})</option>
            <option value="checked_in">Check-in ({statusCounts.checked_in || 0})</option>
            <option value="checked_out">Check-out ({statusCounts.checked_out || 0})</option>
            <option value="cancelled">Cancelada ({statusCounts.cancelled || 0})</option>
          </select>

          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Más Filtros
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reservations.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.pending || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600">Confirmadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.confirmed || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600">En Hotel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.checked_in || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completadas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statusCounts.checked_out || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Grid or Empty State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader size="lg" text="Cargando reservaciones..." variant="spinner" />
          </div>
        ) : filteredReservations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-w-[1600px] mx-auto">
            {filteredReservations.map((reservation: any) => (
              <ReservationCard
                key={reservation._id || reservation.id}
                reservation={{
                  id: reservation._id,
                  confirmationNumber: reservation.confirmationNumber,
                  guest: {
                    firstName: reservation.guestId?.firstName || '',
                    lastName: reservation.guestId?.lastName || '',
                    email: reservation.guestId?.email || '',
                    phone: reservation.guestId?.phone || ''
                  },
                  property: { name: reservation.propertyId?.name || 'N/A' },
                  room: {
                    nameOrNumber: reservation.roomId?.nameOrNumber || 'N/A',
                    type: reservation.roomId?.type || 'N/A'
                  },
                  dates: {
                    checkInDate: reservation.dates?.checkInDate || '',
                    checkOutDate: reservation.dates?.checkOutDate || '',
                    nights: Math.ceil((new Date(reservation.dates?.checkOutDate || '').getTime() - new Date(reservation.dates?.checkInDate || '').getTime()) / (1000 * 60 * 60 * 24))
                  },
                  guests: {
                    adults: reservation.guests?.adults || 0,
                    children: reservation.guests?.children || 0
                  },
                  pricing: {
                    totalPrice: reservation.pricing?.totalPrice || 0,
                    currency: reservation.pricing?.currency || 'USD'
                  },
                  status: reservation.status || 'pending',
                  paymentStatus: reservation.paymentStatus || 'pending',
                  source: reservation.source || 'direct',
                  createdAt: reservation.createdAt || new Date().toISOString()
                }}
                onEdit={() => {
                  setEditingReservation(reservation)
                  setIsDialogOpen(true)
                }}
                onDelete={handleDelete}
                onConfirm={handleConfirm}
                onCheckIn={handleCheckIn}
                onCheckOut={handleCheckOut}
                onCancel={handleCancel}
                onRegisterPayment={(reservationId) => {
                  setSelectedReservationForPayment(reservationId)
                  setIsPaymentDialogOpen(true)
                }}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12">
            <div className="text-center space-y-4">
              <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {searchTerm ? 'No se encontraron reservas' : 'No tienes reservas registradas'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchTerm
                    ? 'Intenta con otros términos de búsqueda o ajusta los filtros'
                    : 'Comienza creando tu primera reserva para gestionar check-ins y check-outs'}
                </p>
              </div>
              <Button onClick={() => {
                setEditingReservation(undefined)
                setIsDialogOpen(true)
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Crear Primera Reserva
              </Button>
            </div>
          </Card>
        )}
      </div>

      <ReservationFormDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) setEditingReservation(undefined)
        }}
        onSuccess={() => {
          refreshReservations()
          refreshRooms()
          refreshGuests()
        }}
        reservation={editingReservation ? {
          _id: editingReservation._id,
          propertyId: editingReservation.propertyId?._id || editingReservation.propertyId,
          roomId: editingReservation.roomId?._id || editingReservation.roomId,
          guestId: editingReservation.guestId?._id || editingReservation.guestId,
          dates: {
            checkInDate: editingReservation.dates?.checkInDate,
            checkOutDate: editingReservation.dates?.checkOutDate,
          },
          guests: editingReservation.guests,
          source: editingReservation.source,
          specialRequests: editingReservation.specialRequests,
          notes: editingReservation.notes,
        } : undefined}
        properties={properties}
        rooms={rooms}
        guests={guests}
      />

      <PaymentFormDialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          setIsPaymentDialogOpen(open)
          if (!open) setSelectedReservationForPayment(undefined)
        }}
        onSuccess={() => {
          refreshReservations()
        }}
        reservations={reservations.map((r: any) => ({
          _id: r._id,
          confirmationNumber: r.confirmationNumber,
          guestId: {
            firstName: r.guestId?.firstName || '',
            lastName: r.guestId?.lastName || ''
          },
          pricing: {
            totalPrice: r.pricing?.totalPrice || 0
          },
          paymentSummary: {
            totalPaid: r.paymentSummary?.totalPaid || 0,
            remainingBalance: r.paymentSummary?.remainingBalance || 0
          }
        }))}
        preselectedReservationId={selectedReservationForPayment}
      />

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
    </MainLayout>
  )
}
