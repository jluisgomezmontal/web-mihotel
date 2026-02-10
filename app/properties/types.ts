export type PropertyType = 'hotel' | 'airbnb' | 'posada'

export interface Property {
  _id: string
  name: string
  type: PropertyType
  address: {
    street?: string
    city: string
    state: string
    country: string
    zipCode?: string
  }
  totalRooms: number
  availableRooms?: number
  occupiedRooms?: number
  monthlyRevenue?: number
  isActive: boolean
}

export interface PropertyCardProps {
  property: Property
  onEdit: (property: Property) => void
  onDelete: (property: Property) => void
}

export interface PropertyStats {
  total: number
  totalRooms: number
  occupiedRooms: number
  totalRevenue: number
}
