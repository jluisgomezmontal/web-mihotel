export const ROOM_STATUS_LABELS = {
  available: 'Disponible',
  occupied: 'Ocupada',
  reserved: 'Reservada',
  maintenance: 'Mantenimiento',
  cleaning: 'Limpieza'
} as const

export const ROOM_TYPE_LABELS = {
  room: 'Habitación',
  suite: 'Suite',
  apartment: 'Apartamento'
} as const

export function getStatusLabel(status: string): string {
  return ROOM_STATUS_LABELS[status as keyof typeof ROOM_STATUS_LABELS] || status
}

export function getTypeLabel(type: string): string {
  return ROOM_TYPE_LABELS[type as keyof typeof ROOM_TYPE_LABELS] || type
}
