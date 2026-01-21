// Authentication Types
export interface User {
  id: string
  tenantId: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'cleaning'
  permissions: {
    canManageProperties: boolean
    canManageUsers: boolean
    canManageReservations: boolean
    canViewReports: boolean
  }
  profile: {
    phone?: string
    avatar?: string
    timezone: string
  }
  lastLoginAt?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Tenant {
  id: string
  name: string
  type: 'hotel' | 'airbnb' | 'posada'
  plan: 'basic' | 'premium' | 'enterprise'
  isActive: boolean
  settings: {
    currency: string
    timezone: string
    language: string
  }
  subscription: {
    startDate: string
    endDate?: string
    isTrialActive: boolean
  }
  createdAt: string
  updatedAt: string
}

// Property & Room Types
export interface Property {
  id: string
  tenantId: string
  name: string
  description?: string
  address: {
    street: string
    city: string
    state: string
    postalCode?: string
    country: string
    coordinates?: {
      latitude: number
      longitude: number
    }
  }
  contact: {
    phone?: string
    email?: string
    website?: string
  }
  timezone: string
  checkInTime: string
  checkOutTime: string
  amenities: string[]
  images: Array<{
    url: string
    caption?: string
    isMain: boolean
  }>
  settings: {
    allowOnlineBooking: boolean
    requireApproval: boolean
    cancellationPolicy: 'flexible' | 'moderate' | 'strict'
    advanceBookingDays: number
  }
  roomsCount?: number
  availableRoomsCount?: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Room {
  id: string
  tenantId: string
  propertyId: string
  nameOrNumber: string
  type: 'room' | 'suite' | 'apartment'
  capacity: {
    adults: number
    children: number
  }
  pricing: {
    basePrice: number
    currency: string
    extraAdultPrice: number
    extraChildPrice: number
  }
  amenities: string[]
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  description?: string
  images: Array<{
    url: string
    caption?: string
    isMain: boolean
  }>
  dimensions?: {
    area: number
    unit: 'sqm' | 'sqft'
  }
  bedConfiguration: Array<{
    type: 'single' | 'double' | 'queen' | 'king' | 'sofa_bed' | 'bunk_bed'
    quantity: number
  }>
  maintenance: {
    lastCleanedAt?: string
    lastMaintenanceAt?: string
    nextMaintenanceDate?: string
    notes?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Guest Types
export interface Guest {
  id: string
  tenantId: string
  firstName: string
  lastName: string
  fullName: string
  email?: string
  phone: {
    primary: string
    secondary?: string
  }
  identification: {
    type: 'passport' | 'national_id' | 'driver_license' | 'other'
    number: string
    expiryDate?: string
    issuingCountry?: string
  }
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  dateOfBirth?: string
  age?: number
  nationality?: string
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  preferences: {
    roomType?: 'room' | 'suite' | 'apartment'
    smokingRoom: boolean
    floor: 'ground' | 'high' | 'any'
    bedType: 'single' | 'double' | 'queen' | 'king' | 'twin'
    dietaryRestrictions: string[]
    accessibility: string[]
  }
  notes?: string
  vipStatus: boolean
  blacklisted: boolean
  blacklistReason?: string
  totalStays: number
  totalSpent: number
  loyaltyPoints: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Reservation Types
export interface Reservation {
  id: string
  tenantId: string
  propertyId: string
  roomId: string
  guestId: string
  confirmationNumber: string
  dates: {
    checkInDate: string
    checkOutDate: string
    actualCheckInDate?: string
    actualCheckOutDate?: string
  }
  guests: {
    adults: number
    children: number
    additionalGuests: Array<{
      firstName: string
      lastName: string
      age?: number
      identification?: string
    }>
  }
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  pricing: {
    roomRate: number
    nights: number
    subtotal: number
    taxes: number
    fees: {
      cleaning: number
      service: number
      extra: number
    }
    totalPrice: number
    currency: string
  }
  paymentStatus: 'pending' | 'partial' | 'paid'
  paymentSummary: {
    totalPaid: number
    remainingBalance: number
    depositRequired: number
    depositPaid: boolean
  }
  source: 'direct' | 'booking_com' | 'airbnb' | 'expedia' | 'phone' | 'walk_in' | 'other'
  specialRequests?: string
  notes?: string
  cancellation?: {
    cancelledAt: string
    cancelledBy: string
    reason: string
    refundAmount: number
  }
  timestamps: {
    bookedAt: string
    confirmedAt?: string
    checkedInAt?: string
    checkedOutAt?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Payment Types
export interface Payment {
  id: string
  tenantId: string
  reservationId: string
  transactionId: string
  amount: number
  currency: string
  method: 'cash' | 'transfer' | 'card'
  status: 'pending' | 'partial' | 'paid'
  details: {
    cardLast4?: string
    cardBrand?: string
    transferReference?: string
    bankName?: string
    receivedBy?: string
    gatewayTransactionId?: string
  }
  fees: {
    processingFee: number
    gatewayFee: number
  }
  netAmount: number
  paymentDate: string
  dueDate?: string
  notes?: string
  refund: {
    isRefunded: boolean
    refundedAmount: number
    refundedAt?: string
    refundReason?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  errors?: string[]
}

export interface PaginatedResponse<T> {
  success: boolean
  data: {
    items: T[]
    pagination: {
      page: number
      limit: number
      total: number
      pages: number
    }
  }
}

// Dashboard Types
export interface DashboardKPIs {
  occupancyRate: number
  totalRooms: number
  occupiedRooms: number
  availableRooms: number
  todaysReservations: number
  checkInsToday: number
  checkOutsToday: number
  totalRevenue: number
  averageRoomRate: number
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  tenant: {
    name: string
    type: 'hotel' | 'airbnb' | 'posada'
    plan?: 'basic' | 'premium' | 'enterprise'
  }
  admin: {
    name: string
    email: string
    password: string
    confirmPassword: string
  }
}

// Filter Types
export interface PropertyFilters {
  search?: string
  city?: string
  state?: string
  isActive?: boolean
}

export interface RoomFilters {
  propertyId?: string
  type?: 'room' | 'suite' | 'apartment'
  status?: 'available' | 'occupied' | 'maintenance' | 'cleaning'
  search?: string
}

export interface ReservationFilters {
  propertyId?: string
  roomId?: string
  guestId?: string
  status?: 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled'
  checkInFrom?: string
  checkInTo?: string
  confirmationNumber?: string
}

export interface GuestFilters {
  search?: string
  vipStatus?: boolean
  blacklisted?: boolean
}

// Component Props Types
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}
