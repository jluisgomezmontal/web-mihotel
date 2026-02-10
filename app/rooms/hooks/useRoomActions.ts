import { useCallback } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import type { Room } from '../types'

export function useRoomActions(loadRooms: () => void) {
  const { confirmDelete, showError, showLoading, close } = useAlert()

  const handleDelete = useCallback(async (room: Room) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar habitación?',
      text: `Se eliminará permanentemente la habitación "${room.nameOrNumber}". Esta acción no se puede deshacer.`,
    })

    if (!confirmed) return

    showLoading('Eliminando habitación...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/rooms/${room._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        loadRooms()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar la habitación')
      }
    } catch (err) {
      close()
      console.error('Error deleting room:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showError, showLoading, close, loadRooms])

  return {
    handleDelete
  }
}
