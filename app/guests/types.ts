/**
 * Guest Types and Interfaces
 * Centralized type definitions for the guests module
 */

export type LoyaltyLevel = 'gold' | 'silver' | 'bronze'
export type GuestStatus = 'blacklisted' | 'vip' | LoyaltyLevel

export interface Guest {
  _id: string
  firstName: string
  lastName: string
  fullName: string
  email?: string
  phone: string
  dateOfBirth?: string
  nationality?: string
  emergencyContact?: {
    name?: string
    relationship?: string
    phone?: string
  }
  vipStatus: boolean
  blacklisted: boolean
  totalStays: number
  totalSpent: number
  loyaltyPoints: number
  notes?: string
  createdAt: string
}

export interface GuestCardProps {
  guest: Guest
  onEdit: (guest: Guest) => void
  onDelete: (id: string) => void
  onToggleVIP: (id: string, currentStatus: boolean) => void
  onReserve: (guestId: string) => void
}

export interface GuestStats {
  total: number
  vip: number
  regular: number
  blacklisted: number
  totalStays: number
  totalRevenue: number
}

export interface GuestFilters {
  searchTerm: string
  vipFilter: string
}
