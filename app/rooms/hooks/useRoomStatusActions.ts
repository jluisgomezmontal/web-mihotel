/**
 * useRoomStatusActions Hook
 * Custom hook for handling room status changes
 */

import { useCallback } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'

interface AlertFunctions {
  showError: (title: string, description?: string) => Promise<void>
  showLoading: (title?: string) => void
  close: () => void
  showSuccess: (title: string, description?: string) => Promise<void>
}

export function useRoomStatusActions(
  refreshRooms: () => void,
  alertFunctions: AlertFunctions
) {
  const { showError, showLoading, close, showSuccess } = alertFunctions

  const handleStatusChange = useCallback(async (roomId: string, newStatus: string) => {
    showLoading('Actualizando estado de habitación...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/rooms/${roomId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      close()

      if (response.ok) {
        await showSuccess(
          '¡Estado actualizado!', 
          `La habitación ahora está ${newStatus === 'available' ? 'disponible' : newStatus}`
        )
        refreshRooms()
      } else {
        const data = await response.json()
        await showError('Error al actualizar', data.message || 'No se pudo actualizar el estado')
      }
    } catch (err) {
      close()
      console.error('Error updating room status:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [showLoading, close, showSuccess, showError, refreshRooms])

  return {
    handleStatusChange
  }
}
