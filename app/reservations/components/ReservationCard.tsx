/**
 * ReservationCard Component
 * Displays individual reservation details with actions
 */

import { 
  User, 
  Edit, 
  Trash2, 
  MoreVertical, 
  Building2, 
  Bed, 
  CreditCard, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  Users, 
  DollarSign,
  ArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatCurrency, formatDate } from "@/lib/utils"
import { StatusBadge } from "./StatusBadge"
import { PaymentStatusBadge } from "./PaymentStatusBadge"
import { RESERVATION_STATUS_CONFIG } from "../constants"
import type { ReservationCardProps } from "../types"

export function ReservationCard({
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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-none shadow-md">
      {/* Gradiente decorativo */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-transparent rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Status Indicator Bar */}
      <div className={cn("h-1.5 w-full transition-all duration-500", RESERVATION_STATUS_CONFIG[reservation.status].barColor)} />
      
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
