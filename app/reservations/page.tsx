"use client"

import * as React from "react"
import { Plus, Search, Filter, Calendar, Clock, CheckCircle, XCircle, AlertTriangle, User, Edit, Trash2, MoreVertical, Building2, Bed, CreditCard, Sparkles, ArrowRight, Users, DollarSign } from "lucide-react"
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
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDate } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthService } from '@/lib/auth'
import { useAlert } from '@/lib/use-alert'
import { API_BASE_URL } from '@/lib/api-config'
import { AlertDialogCustom } from "@/components/ui/alert-dialog-custom"
import { ReservationFormDialog } from "@/components/forms/reservation-form-dialog"
import { PaymentFormDialog } from "@/components/forms/payment-form-dialog"
import { useDashboard } from "@/contexts/DashboardContext"
import { statusColors, getStatusBarColor, actionButtons } from '@/lib/theme-utils'

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
    pending: { 
      label: 'Pendiente', 
      icon: Clock,
      color: 'text-[var(--reservation-pending)]',
      bg: 'bg-[var(--reservation-pending-light)]',
      border: 'border-[var(--reservation-pending)]/20'
    },
    confirmed: { 
      label: 'Confirmada', 
      icon: CheckCircle,
      color: 'text-[var(--reservation-confirmed)]',
      bg: 'bg-[var(--reservation-confirmed-light)]',
      border: 'border-[var(--reservation-confirmed)]/20'
    },
    checked_in: { 
      label: 'Check-in', 
      icon: User,
      color: 'text-[var(--reservation-checked-in)]',
      bg: 'bg-[var(--reservation-checked-in-light)]',
      border: 'border-[var(--reservation-checked-in)]/20'
    },
    checked_out: { 
      label: 'Check-out', 
      icon: CheckCircle,
      color: 'text-[var(--reservation-checked-out)]',
      bg: 'bg-[var(--reservation-checked-out-light)]',
      border: 'border-[var(--reservation-checked-out)]/20'
    },
    cancelled: { 
      label: 'Cancelada', 
      icon: XCircle,
      color: 'text-[var(--reservation-cancelled)]',
      bg: 'bg-[var(--reservation-cancelled-light)]',
      border: 'border-[var(--reservation-cancelled)]/20'
    }
  }

  const { label, icon: Icon, color, bg, border } = config[status]

  return (
    <Badge className={cn("gap-1.5 text-xs font-semibold px-2.5 py-1 border", color, bg, border)}>
      <Icon className="h-3 w-3" />
      {label}
    </Badge>
  )
}

function PaymentStatusBadge({ status }: { status: Reservation['paymentStatus'] }) {
  const config = {
    pending: { 
      label: 'Pendiente',
      color: 'text-[var(--payment-pending)]',
      bg: 'bg-[var(--payment-pending-light)]',
      border: 'border-[var(--payment-pending)]/20'
    },
    partial: { 
      label: 'Parcial',
      color: 'text-[var(--payment-partial)]',
      bg: 'bg-[var(--payment-partial-light)]',
      border: 'border-[var(--payment-partial)]/20'
    },
    paid: { 
      label: 'Pagado',
      color: 'text-[var(--payment-paid)]',
      bg: 'bg-[var(--payment-paid-light)]',
      border: 'border-[var(--payment-paid)]/20'
    }
  }

  const { label, color, bg, border } = config[status]

  return (
    <Badge className={cn("text-xs font-semibold px-2.5 py-1 border", color, bg, border)}>
      <CreditCard className="h-3 w-3 mr-1" />
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

  const statusConfig = {
    pending: { barColor: 'bg-[var(--reservation-pending)]' },
    confirmed: { barColor: 'bg-[var(--reservation-confirmed)]' },
    checked_in: { barColor: 'bg-[var(--reservation-checked-in)]' },
    checked_out: { barColor: 'bg-[var(--reservation-checked-out)]' },
    cancelled: { barColor: 'bg-[var(--reservation-cancelled)]' }
  }

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      {/* Gradiente decorativo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status Indicator Bar */}
      <div className={cn("h-1.5 w-full transition-all duration-500", statusConfig[reservation.status].barColor)} />
      
      <CardHeader className="pb-4 relative">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-3">
            {/* Guest Name & Confirmation */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="p-2 bg-gradient-to-br from-[var(--gradient-primary-from)] to-[var(--gradient-primary-to)] rounded-lg shadow-md group-hover:scale-110 transition-transform duration-300">
                <User className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-lg font-bold">
                  {reservation.guest.firstName} {reservation.guest.lastName}
                </CardTitle>
                <Badge variant="outline" className="font-mono text-xs mt-1">
                  #{reservation.confirmationNumber}
                </Badge>
              </div>
            </div>
            
            {/* Status Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={reservation.status} />
              <PaymentStatusBadge status={reservation.paymentStatus} />
            </div>
            
            {/* Property & Room Info */}
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <Building2 className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
                  <span className="text-xs text-muted-foreground">Propiedad</span>
                </div>
                <p className="text-sm font-semibold truncate">{reservation.property.name}</p>
              </div>
              <div className="p-2.5 bg-gradient-to-br from-[var(--dashboard-warning-light)] to-transparent border border-[var(--dashboard-warning)]/20 rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center gap-2 mb-1">
                  <Bed className="h-3.5 w-3.5 text-[var(--dashboard-warning)]" />
                  <span className="text-xs text-muted-foreground">Habitación</span>
                </div>
                <p className="text-sm font-semibold truncate">{reservation.room.nameOrNumber}</p>
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
                <DropdownMenuItem onClick={handleCancel} className="text-red-300">
                  <XCircle className="mr-2 h-4 w-4" />
                  Cancelar Reserva
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(reservation.id)} className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        {/* Dates Section */}
        <div className="grid grid-cols-2 gap-3 p-3 bg-gradient-to-br from-[var(--surface-elevated)] to-transparent border border-[var(--border-subtle)] rounded-xl">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[var(--dashboard-success)]" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Check-in</p>
            </div>
            <p className="font-semibold text-sm">{formatDate(reservation.dates.checkInDate)}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[var(--dashboard-danger)]" />
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Check-out</p>
            </div>
            <p className="font-semibold text-sm">{formatDate(reservation.dates.checkOutDate)}</p>
          </div>
        </div>

        {/* Pricing & Guests */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-info-light)] to-transparent border border-[var(--dashboard-info)]/20 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-3.5 w-3.5 text-[var(--dashboard-info)]" />
              <span className="text-xs text-muted-foreground">Huéspedes</span>
            </div>
            <p className="font-semibold text-sm">
              {reservation.guests.adults} adulto{reservation.guests.adults !== 1 ? 's' : ''}
              {reservation.guests.children > 0 && `, ${reservation.guests.children} niño${reservation.guests.children !== 1 ? 's' : ''}`}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{reservation.dates.nights} noche{reservation.dates.nights !== 1 ? 's' : ''}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-[var(--dashboard-success-light)] to-transparent border border-[var(--dashboard-success)]/20 rounded-xl hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-1">
              <DollarSign className="h-3.5 w-3.5 text-[var(--dashboard-success)]" />
              <span className="text-xs text-muted-foreground">Total</span>
            </div>
            <p className="font-bold text-xl text-[var(--dashboard-success)]">{formatCurrency(reservation.pricing.totalPrice)}</p>
          </div>
        </div>

        {/* Payment Alert */}
        {hasBalance && (
          <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-[var(--payment-pending-light)] to-transparent border border-[var(--payment-pending)]/30 rounded-xl animate-pulse">
            <div className="p-2 bg-[var(--payment-pending)]/10 rounded-lg">
              <CreditCard className="h-4 w-4 text-[var(--payment-pending)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--text-secondary)]">Saldo pendiente</p>
              <p className="text-base font-bold text-[var(--payment-pending)]">{formatCurrency(balanceAmount)}</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {/* Primary Action Button */}
          {reservation.status === 'confirmed' && (
            <Button size="default" onClick={handleCheckIn} className="group w-full font-semibold bg-[var(--reservation-checked-in)] hover:bg-[var(--reservation-checked-in)]/90 hover:shadow-lg transition-all">
              <CheckCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Realizar Check-in
              <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Button>
          )}
          {reservation.status === 'checked_in' && (
            <Button size="default" onClick={handleCheckOut} className="group w-full font-semibold bg-[var(--reservation-checked-out)] hover:bg-[var(--reservation-checked-out)]/90 hover:shadow-lg transition-all">
              <CheckCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              Realizar Check-out
              <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Button>
          )}
          
          {/* Payment Button - Prominent when balance exists */}
          {hasBalance && ['pending', 'confirmed', 'checked_in'].includes(reservation.status) && (
            <Button 
              size="default" 
              onClick={() => onRegisterPayment(reservation.id)}
              variant={reservation.paymentStatus === 'pending' ? 'default' : 'outline'}
              className="group w-full font-semibold hover:shadow-lg transition-all"
            >
              <CreditCard className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
              {reservation.paymentStatus === 'pending' ? 'Registrar Primer Pago' : 'Registrar Pago Adicional'}
              <ArrowRight className="ml-auto h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Button>
          )}
          
          {/* Secondary Actions */}
          {['pending', 'confirmed'].includes(reservation.status) && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(reservation)}
                className="group flex-1 hover:border-primary/50 transition-all"
              >
                <Edit className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Editar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
                className="group flex-1 text-[var(--reservation-cancelled)] hover:text-[var(--reservation-cancelled)] hover:bg-[var(--reservation-cancelled-light)] hover:border-[var(--reservation-cancelled)]/50 transition-all"
              >
                <XCircle className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
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

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/confirm`, {
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

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/checkin`, {
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

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/checkout`, {
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

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
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

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
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

  if (isLoading) {
    return (
      <MainLayout
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <DashboardSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Mi Hotel", type: "hotel" }}
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header with modern design */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Reservas
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona todas las reservas y procesos de check-in/check-out
            </p>
          </div>

          <Button 
            className="group gap-2 hover:shadow-lg transition-all duration-300" 
            onClick={() => {
              setEditingReservation(undefined)
              setIsDialogOpen(true)
            }}
          >
            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
            Nueva Reserva
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por huésped, confirmación o habitación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-11 border-2 focus:border-primary/50 transition-colors"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] h-11 border-2">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="pending">Pendiente ({statusCounts.pending || 0})</SelectItem>
              <SelectItem value="confirmed">Confirmada ({statusCounts.confirmed || 0})</SelectItem>
              <SelectItem value="checked_in">Check-in ({statusCounts.checked_in || 0})</SelectItem>
              <SelectItem value="checked_out">Check-out ({statusCounts.checked_out || 0})</SelectItem>
              <SelectItem value="cancelled">Cancelada ({statusCounts.cancelled || 0})</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="gap-2 h-11 border-2">
            <Filter className="h-4 w-4" />
            Más Filtros
          </Button>
        </div>

        {/* Stats Cards with modern design */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                <Calendar className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight">{reservations.length}</div>
              <p className="text-xs text-muted-foreground mt-1">reservas totales</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--reservation-pending)]/10 to-[var(--reservation-pending)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--reservation-pending-light)] text-[var(--reservation-pending)] group-hover:scale-110 transition-transform">
                <Clock className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--reservation-pending)]">{statusCounts.pending || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">requieren confirmación</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--reservation-confirmed)]/10 to-[var(--reservation-confirmed)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmadas</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--reservation-confirmed-light)] text-[var(--reservation-confirmed)] group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--reservation-confirmed)]">{statusCounts.confirmed || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">listas para check-in</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--reservation-checked-in)]/10 to-[var(--reservation-checked-in)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">En Hotel</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--reservation-checked-in-light)] text-[var(--reservation-checked-in)] group-hover:scale-110 transition-transform">
                <User className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--reservation-checked-in)]">{statusCounts.checked_in || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">huéspedes activos</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-none shadow-md bg-gradient-to-br from-[var(--reservation-checked-out)]/10 to-[var(--reservation-checked-out)]/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completadas</CardTitle>
              <div className="p-2.5 rounded-xl bg-[var(--reservation-checked-out-light)] text-[var(--reservation-checked-out)] group-hover:scale-110 transition-transform">
                <CheckCircle className="h-5 w-5" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-[var(--reservation-checked-out)]">{statusCounts.checked_out || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">check-outs realizados</p>
            </CardContent>
          </Card>
        </div>

        {/* Reservations Grid or Empty State */}
        {filteredReservations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
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
          <Card className="border-none shadow-md p-16">
            <div className="text-center space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
                <Calendar className="relative mx-auto h-20 w-20 text-primary/40" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">
                  {searchTerm || statusFilter !== 'all' ? 'No se encontraron reservas' : 'No tienes reservas registradas'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all'
                    ? 'Intenta ajustar los filtros de búsqueda o eliminar algunos criterios'
                    : 'Comienza creando tu primera reserva para gestionar check-ins y check-outs de huéspedes'}
                </p>
              </div>
              <Button 
                onClick={() => {
                  setEditingReservation(undefined)
                  setIsDialogOpen(true)
                }}
                className="group gap-2 hover:shadow-lg transition-all"
                size="lg"
              >
                <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
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
