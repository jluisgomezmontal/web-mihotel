import { useState, useCallback, useEffect } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import type { Property, Room } from '../types'

export function usePropertyDetail(propertyId: string) {
  const [property, setProperty] = useState<Property | null>(null)
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)
  const [tenantData, setTenantData] = useState<any>(null)

  const loadPropertyDetails = useCallback(async () => {
    try {
      setIsLoading(true)
      
      const user = AuthService.getUser()
      const tenant = AuthService.getTenant()
      const token = AuthService.getToken()
      
      setUserData(user)
      setTenantData(tenant)
      
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const propertyResponse = await fetch(`${API_BASE_URL}/properties/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (propertyResponse.ok) {
        const propertyData = await propertyResponse.json()
        setProperty(propertyData.data?.property || null)
      } else if (propertyResponse.status === 401) {
        AuthService.clearAuth()
        window.location.href = '/auth/login'
        return
      } else {
        setError('Error al cargar la propiedad')
        return
      }

      const roomsResponse = await fetch(`${API_BASE_URL}/rooms/property/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (roomsResponse.ok) {
        const roomsData = await roomsResponse.json()
        const roomsArray = roomsData.data?.rooms || roomsData.rooms || []
        setRooms(Array.isArray(roomsArray) ? roomsArray : [])
      }

    } catch (err) {
      console.error('Error loading property details:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [propertyId])

  const loadRooms = useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const roomsResponse = await fetch(`${API_BASE_URL}/rooms/property/${propertyId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (roomsResponse.ok) {
        const response = await roomsResponse.json()
        const roomsArray = response.data?.rooms || response.rooms || []
        setRooms(Array.isArray(roomsArray) ? roomsArray : [])
      }
    } catch (error) {
      console.error('Error loading rooms:', error)
    }
  }, [propertyId])

  useEffect(() => {
    if (propertyId) {
      loadPropertyDetails()
    }
  }, [propertyId, loadPropertyDetails])

  return {
    property,
    rooms,
    isLoading,
    error,
    userData,
    tenantData,
    loadPropertyDetails,
    loadRooms
  }
}
