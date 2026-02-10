import { Hotel, Building2 } from "lucide-react"

export const PROPERTY_TYPE_LABELS = {
  hotel: 'Hotel',
  airbnb: 'Airbnb',
  posada: 'Posada'
} as const

export const PROPERTY_TYPE_ICONS = {
  hotel: Hotel,
  airbnb: Building2,
  posada: Building2
} as const

export function getOccupancyVariant(rate: number): 'success' | 'warning' | 'danger' {
  if (rate >= 80) return 'success'
  if (rate >= 60) return 'warning'
  return 'danger'
}

export function getOccupancyColor(rate: number): string {
  if (rate >= 80) return 'text-[var(--dashboard-success)]'
  if (rate >= 60) return 'text-[var(--dashboard-warning)]'
  return 'text-[var(--dashboard-danger)]'
}

export function getOccupancyBg(rate: number): string {
  if (rate >= 80) return 'bg-[var(--dashboard-success-light)] border-[var(--dashboard-success)]/20'
  if (rate >= 60) return 'bg-[var(--dashboard-warning-light)] border-[var(--dashboard-warning)]/20'
  return 'bg-[var(--dashboard-danger-light)] border-[var(--dashboard-danger)]/20'
}

export function getOccupancyBarColor(rate: number): string {
  if (rate >= 80) return 'bg-[var(--dashboard-success)]'
  if (rate >= 60) return 'bg-[var(--dashboard-warning)]'
  return 'bg-[var(--dashboard-danger)]'
}
