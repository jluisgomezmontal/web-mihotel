export type KPIVariant = 'default' | 'success' | 'warning' | 'info' | 'danger'
export type TrendType = 'up' | 'down' | 'neutral'
export type ReservationStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out'

export interface KPICardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ElementType
  description?: string
  variant?: KPIVariant
  trend?: TrendType
}

export interface ReservationItemProps {
  guest: string
  room: string
  checkIn: string
  checkOut: string
  status: ReservationStatus
  nights: number
  amount: number
}

export interface DashboardMetrics {
  occupancyRate: number
  totalRooms: number
  availableRooms: number
  occupiedRooms: number
  cleaningRooms: number
  maintenanceRooms: number
  todayCheckIns: number
  todayCheckOuts: number
  totalRevenue: number
  monthlyRevenue: number
  averageRate: number
  pendingReservations: number
  activeGuests: number
}
