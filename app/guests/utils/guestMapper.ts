/**
 * Guest Data Mapper
 * Utility functions for transforming guest data
 */

import type { Guest } from '../types'

/**
 * Maps guests for reservation dialog
 */
export function mapGuestsForReservation(guests: Guest[]) {
  return guests.map(g => ({
    _id: g._id,
    firstName: g.firstName,
    lastName: g.lastName,
    email: g.email || ''
  }))
}

/**
 * Formats guest full name
 */
export function formatGuestName(guest: Guest): string {
  return `${guest.firstName} ${guest.lastName}`
}

/**
 * Checks if guest has complete contact info
 */
export function hasCompleteContactInfo(guest: Guest): boolean {
  return !!(guest.phone && guest.email)
}

/**
 * Calculates guest lifetime value
 */
export function calculateLifetimeValue(guest: Guest): number {
  return guest.totalSpent
}

/**
 * Gets guest display status
 */
export function getGuestDisplayStatus(guest: Guest): string {
  if (guest.blacklisted) return 'Bloqueado'
  if (guest.vipStatus) return 'VIP'
  
  const loyaltyLevel = guest.totalStays >= 10 ? 'Gold' : guest.totalStays >= 5 ? 'Silver' : 'Bronze'
  return loyaltyLevel
}
