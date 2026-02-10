import { useCallback } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import type { Property } from '../types'

export function usePropertyActions(refreshProperties: () => void) {
  const { confirmDelete, showError, showLoading, close } = useAlert()

  const handleDelete = useCallback(async (property: Property) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar propiedad?',
      text: `Se eliminará permanentemente la propiedad "${property.name}" y todas sus habitaciones asociadas. Esta acción no se puede deshacer.`,
    })

    if (!confirmed) return

    showLoading('Eliminando propiedad...')
    
    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/properties/${property._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        refreshProperties()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar la propiedad')
      }
    } catch (err) {
      close()
      console.error('Error deleting property:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showError, showLoading, close, refreshProperties])

  return {
    handleDelete
  }
}
