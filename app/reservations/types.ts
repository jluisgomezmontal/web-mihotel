/**
 * Reservation Types and Interfaces
 * Centralized type definitions for the reservations module
 */

export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
export type PaymentStatus = 'pending' | 'partial' | 'paid'

export interface Reservation {
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
  status: ReservationStatus
  pricing: {
    totalPrice: number
    currency: string
  }
  paymentStatus: PaymentStatus
  source: string
  createdAt: string
}

export interface ReservationCardProps {
  reservation: Reservation
  onEdit: (reservation: any) => void
  onDelete: (id: string) => void
  onConfirm: (id: string) => void
  onCheckIn: (id: string) => void
  onCheckOut: (id: string) => void
  onCancel: (id: string) => void
  onRegisterPayment: (reservationId: string) => void
}

export interface StatusCounts {
  pending?: number
  confirmed?: number
  checked_in?: number
  checked_out?: number
  cancelled?: number
}
