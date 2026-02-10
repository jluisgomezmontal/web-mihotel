/**
 * useReservationFilters Hook
 * Custom hook for filtering and searching reservations
 */

import { useMemo } from 'react'
import type { StatusCounts } from '../types'

export function useReservationFilters(
  reservations: any[],
  searchTerm: string,
  statusFilter: string
) {
  const filteredReservations = useMemo(() => {
    const reservationsArray = Array.isArray(reservations) ? reservations : []

    return reservationsArray.filter((reservation: any) => {
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
  }, [reservations, searchTerm, statusFilter])

  const statusCounts = useMemo<StatusCounts>(() => {
    const reservationsArray = Array.isArray(reservations) ? reservations : []
    
    return reservationsArray.reduce((acc: any, reservation: any) => {
      acc[reservation.status] = (acc[reservation.status] || 0) + 1
      return acc
    }, {} as StatusCounts)
  }, [reservations])

  return {
    filteredReservations,
    statusCounts
  }
}
