/**
 * Reservation Constants and Configurations
 * Centralized configuration for reservation status and payment status
 */

import { Clock, CheckCircle, User, XCircle, CreditCard } from "lucide-react"
import type { ReservationStatus, PaymentStatus } from "./types"

export const RESERVATION_STATUS_CONFIG = {
  pending: { 
    label: 'Pendiente', 
    icon: Clock,
    color: 'text-[var(--reservation-pending)]',
    bg: 'bg-[var(--reservation-pending-light)]',
    border: 'border-[var(--reservation-pending)]/20',
    barColor: 'bg-[var(--reservation-pending)]'
  },
  confirmed: { 
    label: 'Confirmada', 
    icon: CheckCircle,
    color: 'text-[var(--reservation-confirmed)]',
    bg: 'bg-[var(--reservation-confirmed-light)]',
    border: 'border-[var(--reservation-confirmed)]/20',
    barColor: 'bg-[var(--reservation-confirmed)]'
  },
  checked_in: { 
    label: 'Check-in', 
    icon: User,
    color: 'text-[var(--reservation-checked-in)]',
    bg: 'bg-[var(--reservation-checked-in-light)]',
    border: 'border-[var(--reservation-checked-in)]/20',
    barColor: 'bg-[var(--reservation-checked-in)]'
  },
  checked_out: { 
    label: 'Check-out', 
    icon: CheckCircle,
    color: 'text-[var(--reservation-checked-out)]',
    bg: 'bg-[var(--reservation-checked-out-light)]',
    border: 'border-[var(--reservation-checked-out)]/20',
    barColor: 'bg-[var(--reservation-checked-out)]'
  },
  cancelled: { 
    label: 'Cancelada', 
    icon: XCircle,
    color: 'text-[var(--reservation-cancelled)]',
    bg: 'bg-[var(--reservation-cancelled-light)]',
    border: 'border-[var(--reservation-cancelled)]/20',
    barColor: 'bg-[var(--reservation-cancelled)]'
  }
} as const

export const PAYMENT_STATUS_CONFIG = {
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
} as const

export const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos los estados' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmada' },
  { value: 'checked_in', label: 'Check-in' },
  { value: 'checked_out', label: 'Check-out' },
  { value: 'cancelled', label: 'Cancelada' }
] as const
