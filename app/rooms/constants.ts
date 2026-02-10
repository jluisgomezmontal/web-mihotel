import { CheckCircle2, AlertCircle, Wrench, Loader2 } from "lucide-react"

export const ROOM_STATUS_CONFIG = {
  available: {
    color: 'text-[var(--room-available)]',
    bg: 'bg-[var(--room-available-light)]',
    border: 'border-[var(--room-available)]/20',
    icon: CheckCircle2,
    label: 'Disponible',
    barColor: 'bg-[var(--room-available)]'
  },
  occupied: {
    color: 'text-[var(--room-occupied)]',
    bg: 'bg-[var(--room-occupied-light)]',
    border: 'border-[var(--room-occupied)]/20',
    icon: AlertCircle,
    label: 'Ocupada',
    barColor: 'bg-[var(--room-occupied)]'
  },
  reserved: {
    color: 'text-[var(--room-reserved)]',
    bg: 'bg-[var(--room-reserved-light)]',
    border: 'border-[var(--room-reserved)]/20',
    icon: CheckCircle2,
    label: 'Reservada',
    barColor: 'bg-[var(--room-reserved)]'
  },
  maintenance: {
    color: 'text-[var(--room-maintenance)]',
    bg: 'bg-[var(--room-maintenance-light)]',
    border: 'border-[var(--room-maintenance)]/20',
    icon: Wrench,
    label: 'Mantenimiento',
    barColor: 'bg-[var(--room-maintenance)]'
  },
  cleaning: {
    color: 'text-[var(--room-cleaning)]',
    bg: 'bg-[var(--room-cleaning-light)]',
    border: 'border-[var(--room-cleaning)]/20',
    icon: Loader2,
    label: 'Limpieza',
    barColor: 'bg-[var(--room-cleaning)]'
  }
} as const

export const ROOM_TYPE_LABELS = {
  room: 'Habitación',
  suite: 'Suite',
  apartment: 'Apartamento'
} as const

export function getStatusConfig(status: string) {
  return ROOM_STATUS_CONFIG[status as keyof typeof ROOM_STATUS_CONFIG] || ROOM_STATUS_CONFIG.available
}

export function getTypeLabel(type: string): string {
  return ROOM_TYPE_LABELS[type as keyof typeof ROOM_TYPE_LABELS] || type
}
