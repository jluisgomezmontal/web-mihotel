export type RoomStatus = 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'reserved'
export type RoomType = 'room' | 'suite' | 'apartment'

export interface Room {
  _id: string
  propertyId: {
    _id: string
    name: string
    address: {
      city: string
    }
  }
  nameOrNumber: string
  type: string
  capacity: {
    adults: number
    children?: number
  }
  pricing: {
    basePrice: number
    currency: string
  }
  status: RoomStatus
  amenities?: string[]
  description?: string
  isActive: boolean
}

export interface RoomCardProps {
  room: Room
  onEdit: (room: Room) => void
  onDelete: (room: Room) => void
  onStatusChange?: (roomId: string, newStatus: string) => void
}

export interface RoomStats {
  total: number
  available: number
  occupied: number
  cleaning: number
  maintenance: number
}
