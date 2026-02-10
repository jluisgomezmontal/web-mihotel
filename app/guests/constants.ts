/**
 * Guest Constants and Configurations
 * Centralized configuration for guest status and loyalty levels
 */

import type { GuestStatus, LoyaltyLevel } from "./types"

export const GUEST_STATUS_CONFIG = {
  blacklisted: { 
    barColor: 'bg-[var(--guest-blacklisted)]',
    label: 'Bloqueado',
    color: 'text-[var(--guest-blacklisted)]',
    bg: 'bg-[var(--guest-blacklisted-light)]',
    border: 'border-[var(--guest-blacklisted)]/20'
  },
  vip: { 
    barColor: 'bg-[var(--loyalty-vip)]',
    label: 'VIP',
    color: 'text-[var(--loyalty-vip)]',
    bg: 'bg-[var(--loyalty-vip-light)]',
    border: 'border-[var(--loyalty-vip)]/20'
  },
  gold: { 
    barColor: 'bg-[var(--loyalty-gold)]',
    label: 'Gold',
    color: 'text-[var(--loyalty-gold)]',
    bg: 'bg-[var(--loyalty-gold-light)]',
    border: 'border-[var(--loyalty-gold)]/20'
  },
  silver: { 
    barColor: 'bg-[var(--loyalty-silver)]',
    label: 'Silver',
    color: 'text-[var(--loyalty-silver)]',
    bg: 'bg-[var(--loyalty-silver-light)]',
    border: 'border-[var(--loyalty-silver)]/20'
  },
  bronze: { 
    barColor: 'bg-[var(--loyalty-bronze)]',
    label: 'Bronze',
    color: 'text-[var(--loyalty-bronze)]',
    bg: 'bg-[var(--loyalty-bronze-light)]',
    border: 'border-[var(--loyalty-bronze)]/20'
  }
} as const

export const LOYALTY_THRESHOLDS = {
  GOLD: 10,
  SILVER: 5,
  BRONZE: 0
} as const

export const VIP_FILTER_OPTIONS = [
  { value: 'all', label: 'Todos los huéspedes' },
  { value: 'vip', label: 'VIP' },
  { value: 'regular', label: 'Regular' }
] as const

/**
 * Calculate loyalty level based on total stays
 */
export function getLoyaltyLevel(totalStays: number): LoyaltyLevel {
  if (totalStays >= LOYALTY_THRESHOLDS.GOLD) return 'gold'
  if (totalStays >= LOYALTY_THRESHOLDS.SILVER) return 'silver'
  return 'bronze'
}

/**
 * Get current guest status (priority: blacklisted > vip > loyalty)
 */
export function getGuestStatus(guest: { blacklisted: boolean; vipStatus: boolean; totalStays: number }): GuestStatus {
  if (guest.blacklisted) return 'blacklisted'
  if (guest.vipStatus) return 'vip'
  return getLoyaltyLevel(guest.totalStays)
}
