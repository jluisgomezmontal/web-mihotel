import { useState, useCallback, useEffect } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useDashboard } from '@/contexts/DashboardContext'
import type { Room } from '../types'

export function useRoomData(statusFilter: string, typeFilter: string, searchTerm: string) {
  const [rooms, setRooms] = useState<Room[]>([])
  const [properties, setProperties] = useState<Array<{ _id: string; name: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)
  const { refreshRooms: refreshDashboardRooms } = useDashboard()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const loadRooms = useCallback(async () => {
    try {
      setIsLoading(true)
      
      const token = AuthService.getToken()
      
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`${API_BASE_URL}/rooms?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        const roomsArray = data.data?.rooms || data.rooms || []
        setRooms(Array.isArray(roomsArray) ? roomsArray : [])
        await refreshDashboardRooms()
      } else if (response.status === 401) {
        AuthService.clearAuth()
        window.location.href = '/auth/login'
      } else {
        setError('Error al cargar las habitaciones')
      }
    } catch (err) {
      console.error('Error loading rooms:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [statusFilter, typeFilter, searchTerm, refreshDashboardRooms])

  const loadProperties = useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/properties`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        const propertiesArray = data.data?.properties || data.properties || []
        setProperties(Array.isArray(propertiesArray) ? propertiesArray : [])
      }
    } catch (err) {
      console.error('Error loading properties:', err)
    }
  }, [])

  useEffect(() => {
    if (!isMounted) return
    loadRooms()
    loadProperties()
  }, [isMounted, loadRooms, loadProperties])

  return {
    rooms,
    properties,
    isLoading,
    error,
    loadRooms
  }
}
