/**
 * useGuestActions Hook
 * Custom hook for handling all guest-related API operations
 */

import { useCallback } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'

export function useGuestActions(refreshGuests: () => void) {
  const { confirmDelete, showError, showLoading, close, showSuccess } = useAlert()

  const handleDelete = useCallback(async (guestId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar huésped?',
      text: 'Esta acción no se puede deshacer. El huésped será eliminado permanentemente.',
    })

    if (!confirmed) return

    showLoading('Eliminando huésped...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/guests/${guestId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        await showSuccess('Huésped eliminado', 'El huésped ha sido eliminado exitosamente')
        refreshGuests()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar el huésped')
      }
    } catch (err) {
      close()
      console.error('Error deleting guest:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showLoading, close, showSuccess, showError, refreshGuests])

  const handleToggleVIP = useCallback(async (guestId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus
    const confirmed = await confirmDelete({
      title: newStatus ? '¿Marcar como VIP?' : '¿Remover estatus VIP?',
      text: newStatus 
        ? 'El huésped será marcado como VIP y recibirá beneficios especiales.'
        : 'Se removerá el estatus VIP del huésped.',
      confirmButtonText: newStatus ? 'Sí, marcar VIP' : 'Sí, remover',
    })

    if (!confirmed) return

    showLoading('Actualizando estatus...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/guests/${guestId}/vip`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ vipStatus: newStatus })
      })

      close()

      if (response.ok) {
        await showSuccess(
          'Estatus actualizado', 
          newStatus ? 'Huésped marcado como VIP' : 'Estatus VIP removido'
        )
        refreshGuests()
      } else {
        const data = await response.json()
        await showError('Error al actualizar', data.message || 'No se pudo actualizar el estatus')
      }
    } catch (err) {
      close()
      console.error('Error updating VIP status:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showLoading, close, showSuccess, showError, refreshGuests])

  return {
    handleDelete,
    handleToggleVIP
  }
}
