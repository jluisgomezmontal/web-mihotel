/**
 * useGuestData Hook
 * Custom hook for loading and managing guest data
 */

import { useState, useCallback, useEffect } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import type { Guest } from '../types'

export function useGuestData() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [properties, setProperties] = useState<Array<{ _id: string; name: string }>>([])
  const [rooms, setRooms] = useState<Array<{ _id: string; nameOrNumber: string; propertyId: string }>>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showError } = useAlert()

  const loadGuests = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/guests?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setGuests(data.data?.guests || [])
      } else {
        await showError('Error al cargar', 'No se pudieron cargar los huéspedes')
      }
    } catch (err) {
      console.error('Error loading guests:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  const loadPropertiesAndRooms = useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const [propertiesRes, roomsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/properties?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/rooms?limit=100`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (propertiesRes.ok) {
        const data = await propertiesRes.json()
        setProperties(data.data?.properties || [])
      }

      if (roomsRes.ok) {
        const data = await roomsRes.json()
        setRooms(data.data?.rooms || [])
      }
    } catch (err) {
      console.error('Error loading properties and rooms:', err)
    }
  }, [])

  useEffect(() => {
    loadGuests()
    loadPropertiesAndRooms()
  }, [loadGuests, loadPropertiesAndRooms])

  return {
    guests,
    properties,
    rooms,
    isLoading,
    loadGuests,
    loadPropertiesAndRooms
  }
}
