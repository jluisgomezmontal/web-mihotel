/**
 * useGuestFilters Hook
 * Custom hook for filtering and searching guests
 */

import { useMemo } from 'react'
import type { Guest, GuestStats } from '../types'

export function useGuestFilters(
  guests: Guest[],
  searchTerm: string,
  vipFilter: string
) {
  const filteredGuests = useMemo(() => {
    return guests.filter((guest) => {
      const fullName = `${guest.firstName} ${guest.lastName}`.toLowerCase()
      const email = guest.email?.toLowerCase() || ''
      const phone = guest.phone.toLowerCase()
      
      const matchesSearch = 
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        phone.includes(searchTerm.toLowerCase())

      const matchesVIP = 
        vipFilter === "all" || 
        (vipFilter === "vip" && guest.vipStatus) ||
        (vipFilter === "regular" && !guest.vipStatus)

      return matchesSearch && matchesVIP
    })
  }, [guests, searchTerm, vipFilter])

  const stats = useMemo<GuestStats>(() => {
    return {
      total: guests.length,
      vip: guests.filter(g => g.vipStatus).length,
      regular: guests.filter(g => !g.vipStatus && !g.blacklisted).length,
      blacklisted: guests.filter(g => g.blacklisted).length,
      totalStays: guests.reduce((sum, g) => sum + g.totalStays, 0),
      totalRevenue: guests.reduce((sum, g) => sum + g.totalSpent, 0)
    }
  }, [guests])

  return {
    filteredGuests,
    stats
  }
}
