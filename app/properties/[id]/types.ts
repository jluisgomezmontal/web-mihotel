export interface Property {
  _id: string
  name: string
  type: string
  description?: string
  address: {
    street: string
    city: string
    state: string
    country: string
    postalCode?: string
  }
  contact?: {
    phone?: string
    email?: string
  }
  timezone: string
  checkInTime: string
  checkOutTime: string
  amenities?: string[]
  isActive: boolean
}

export interface Room {
  _id: string
  propertyId: string
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
  status: string
  amenities?: string[]
  isActive: boolean
}

export interface RoomStats {
  total: number
  available: number
  occupied: number
}

export interface RoomCardProps {
  room: Room
  onEdit: (room: Room) => void
  onDelete: (room: Room) => void
}
