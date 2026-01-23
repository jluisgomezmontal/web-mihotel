"use client"

import * as React from "react"
import { AuthService } from "@/lib/auth"
import type { User as UserType } from "@/types"

interface Property {
  _id: string
  name: string
  type: 'hotel' | 'airbnb' | 'posada'
  address: {
    street?: string
    city: string
    state: string
    country: string
    zipCode?: string
  }
  totalRooms: number
  occupiedRooms?: number
  availableRooms?: number
  monthlyRevenue?: number
  isActive: boolean
}

interface Reservation {
  _id: string
  guestId?: {
    firstName?: string
    lastName?: string
  }
  roomId?: {
    nameOrNumber?: string
  }
  dates?: {
    checkInDate: string
    checkOutDate: string
    nights: number
  }
  pricing?: {
    totalPrice: number
  }
  status: 'pending' | 'confirmed' | 'checked_in' | 'checked_out'
}

interface Tenant {
  name: string
  type: string
}

interface Room {
  _id: string
  nameOrNumber: string
  propertyId: string
  type: string
  status: string
}

interface Guest {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface DashboardContextType {
  properties: Property[]
  reservations: Reservation[]
  rooms: Room[]
  guests: Guest[]
  userData: (UserType & { _id: string }) | null
  tenantData: Tenant | null
  isLoading: boolean
  error: string | null
  refreshProperties: () => Promise<void>
  refreshReservations: () => Promise<void>
  refreshRooms: () => Promise<void>
  refreshGuests: () => Promise<void>
  refreshAll: () => Promise<void>
}

const DashboardContext = React.createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [properties, setProperties] = React.useState<Property[]>([])
  const [reservations, setReservations] = React.useState<Reservation[]>([])
  const [rooms, setRooms] = React.useState<Room[]>([])
  const [guests, setGuests] = React.useState<Guest[]>([])
  const [userData, setUserData] = React.useState<(UserType & { _id: string }) | null>(null)
  const [tenantData, setTenantData] = React.useState<Tenant | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  const refreshProperties = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch('http://localhost:3000/api/properties', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        const propertiesArray = data.data?.properties || data.properties || data.data || []
        
        const mappedProperties = (Array.isArray(propertiesArray) ? propertiesArray : []).map((prop: any) => ({
          ...prop,
          totalRooms: prop.roomsCount || 0,
          availableRooms: prop.availableRoomsCount || 0,
          occupiedRooms: (prop.roomsCount || 0) - (prop.availableRoomsCount || 0)
        }))
        
        setProperties(mappedProperties)
      }
    } catch (err) {
      console.error('Error fetching properties:', err)
      setError('Error al cargar las propiedades')
    }
  }, [])

  const refreshReservations = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch(`http://localhost:3000/api/reservations?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        console.log('📅 Reservations cargadas en contexto:', data.data?.reservations?.length || 0)
        setReservations(data.data?.reservations || [])
      } else {
        console.error('❌ Error al cargar reservations, status:', response.status)
        if (response.status !== 429) {
          const errorData = await response.json().catch(() => ({}))
          console.error('Error details:', errorData)
        }
      }
    } catch (err) {
      console.error('Error fetching reservations:', err)
      setError('Error al cargar las reservas')
    }
  }, [])

  const refreshRooms = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch('http://localhost:3000/api/rooms?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        const roomsData = data.data?.rooms || []
        console.log('🏨 Rooms cargadas en contexto:', roomsData.length)
        console.log('📊 Estructura de rooms:', roomsData.map((r: any) => ({ 
          _id: r._id, 
          nameOrNumber: r.nameOrNumber, 
          propertyId: r.propertyId 
        })))
        setRooms(roomsData)
      } else {
        console.error('❌ Error al cargar rooms, status:', response.status)
      }
    } catch (err) {
      console.error('Error fetching rooms:', err)
    }
  }, [])

  const refreshGuests = React.useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch('http://localhost:3000/api/guests?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        const guestsData = data.data?.guests || []
        console.log('👥 Guests cargados en contexto:', guestsData.length, guestsData.slice(0, 2))
        setGuests(guestsData)
      } else {
        console.error('❌ Error al cargar guests, status:', response.status)
      }
    } catch (err) {
      console.error('Error fetching guests:', err)
    }
  }, [])

  const refreshAll = React.useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const user = AuthService.getUser()
      const tenant = AuthService.getTenant()
      const token = AuthService.getToken()
      
      // Map user.id to _id for compatibility
      if (user) {
        setUserData({ ...user, _id: user.id })
      } else {
        setUserData(null)
      }
      setTenantData(tenant)

      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      await Promise.all([
        refreshProperties(), 
        refreshReservations(),
        refreshRooms(),
        refreshGuests()
      ])
    } catch (err) {
      console.error('Error loading dashboard data:', err)
      setError('Error al cargar los datos')
    } finally {
      setIsLoading(false)
    }
  }, [refreshProperties, refreshReservations, refreshRooms, refreshGuests])

  React.useEffect(() => {
    if (!isMounted) return
    refreshAll()
  }, [isMounted, refreshAll])

  const value = React.useMemo(
    () => ({
      properties,
      reservations,
      rooms,
      guests,
      userData,
      tenantData,
      isLoading,
      error,
      refreshProperties,
      refreshReservations,
      refreshRooms,
      refreshGuests,
      refreshAll,
    }),
    [properties, reservations, rooms, guests, userData, tenantData, isLoading, error, refreshProperties, refreshReservations, refreshRooms, refreshGuests, refreshAll]
  )

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = React.useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
