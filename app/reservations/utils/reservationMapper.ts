/**
 * Reservation Data Mapper
 * Utility functions for transforming reservation data
 */

import type { Reservation } from '../types'

/**
 * Maps raw reservation data from API to Reservation type
 */
export function mapReservationData(reservation: any): Reservation {
  return {
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
      nights: Math.ceil(
        (new Date(reservation.dates?.checkOutDate || '').getTime() - 
         new Date(reservation.dates?.checkInDate || '').getTime()) / 
        (1000 * 60 * 60 * 24)
      )
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
  }
}

/**
 * Maps reservation for form editing
 */
export function mapReservationForEdit(reservation: any) {
  return {
    _id: reservation._id,
    propertyId: reservation.propertyId?._id || reservation.propertyId,
    roomId: reservation.roomId?._id || reservation.roomId,
    guestId: reservation.guestId?._id || reservation.guestId,
    dates: {
      checkInDate: reservation.dates?.checkInDate,
      checkOutDate: reservation.dates?.checkOutDate,
    },
    guests: reservation.guests,
    source: reservation.source,
    specialRequests: reservation.specialRequests,
    notes: reservation.notes,
  }
}

/**
 * Maps reservations for payment dialog
 */
export function mapReservationsForPayment(reservations: any[]) {
  return reservations.map((r: any) => ({
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
  }))
}
