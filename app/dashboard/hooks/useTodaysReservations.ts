import { useMemo } from 'react'

export function useTodaysReservations(reservations: any[]) {
  return useMemo(() => {
    const reservationsArray = Array.isArray(reservations) ? reservations : []
    const today = new Date().toISOString().split('T')[0]
    
    return reservationsArray.filter(r => {
      if (!r.dates?.checkInDate && !r.dates?.checkOutDate) return false
      
      const checkInDate = r.dates?.checkInDate ? new Date(r.dates.checkInDate).toISOString().split('T')[0] : null
      const checkOutDate = r.dates?.checkOutDate ? new Date(r.dates.checkOutDate).toISOString().split('T')[0] : null
      
      return checkInDate === today || checkOutDate === today
    }).sort((a, b) => {
      const aCheckIn = a.dates?.checkInDate ? new Date(a.dates.checkInDate).getTime() : 0
      const bCheckIn = b.dates?.checkInDate ? new Date(b.dates.checkInDate).getTime() : 0
      return aCheckIn - bCheckIn
    })
  }, [reservations])
}
