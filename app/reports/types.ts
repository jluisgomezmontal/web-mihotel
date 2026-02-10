export interface ReportData {
  revenue?: RevenueReport
  occupancy?: OccupancyReport
  guests?: GuestsReport
  reservations?: ReservationsReport
  dashboard?: DashboardReport
}

export interface RevenueReport {
  totals?: {
    totalRevenue: number
    totalPayments: number
    avgPayment: number
  }
  methodBreakdown?: Array<{
    _id: string
    total: number
  }>
  revenueData?: any[]
}

export interface OccupancyReport {
  avgOccupancy: number
  totalRooms: number
  occupancyByDay?: any[]
}

export interface GuestsReport {
  totalGuests: number
  newGuests: number
  vipGuests: number
  topGuests?: Array<{
    firstName: string
    lastName: string
    email: string
    totalSpent: number
    totalStays: number
    vipStatus: boolean
  }>
  nationalityStats?: Array<{
    _id: string
    count: number
  }>
}

export interface ReservationsReport {
  avgStay?: {
    avgNights: number
    totalReservations: number
  }
  statusBreakdown?: Array<{
    _id: string
    count: number
  }>
  sourceBreakdown?: Array<{
    _id: string
    count: number
  }>
  byProperty?: Array<{
    propertyName: string
    count: number
    revenue: number
  }>
}

export interface DashboardReport {
  todayCheckIns: number
  todayCheckOuts: number
  occupancyRate: number
  occupiedRooms: number
  totalRooms: number
  monthlyRevenue: number
  activeGuests: number
  pendingReservations: number
}
