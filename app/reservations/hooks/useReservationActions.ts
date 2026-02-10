/**
 * useReservationActions Hook
 * Custom hook for handling all reservation-related API operations
 */

import { useCallback } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'

export function useReservationActions(refreshReservations: () => void) {
  const { confirmDelete, showError, showLoading, close, showSuccess } = useAlert()

  const handleConfirm = useCallback(async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Confirmar Reserva?',
      text: 'La reserva pasará de pendiente a confirmada.',
      confirmButtonText: 'Sí, Confirmar',
    })

    if (!confirmed) return

    showLoading('Confirmando reserva...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/confirm`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        close()
        await showSuccess('¡Reserva confirmada!', 'La reserva ha sido confirmada exitosamente')
        refreshReservations()
      } else {
        const data = await response.json()
        close()
        await showError('Error al confirmar', data.message || 'No se pudo confirmar la reserva')
      }
    } catch (err) {
      close()
      console.error('Error confirming reservation:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showLoading, close, showSuccess, showError, refreshReservations])

  const handleCheckIn = useCallback(async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Realizar Check-in?',
      text: 'El huésped será marcado como en el hotel y la habitación como ocupada.',
      confirmButtonText: 'Sí, Check-in',
    })

    if (!confirmed) return

    showLoading('Procesando check-in...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/checkin`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      close()

      if (response.ok) {
        await showSuccess('Check-in realizado', 'El huésped ha sido registrado exitosamente')
        refreshReservations()
      } else {
        const data = await response.json()
        await showError('Error al realizar check-in', data.message || 'No se pudo completar el check-in')
      }
    } catch (err) {
      close()
      console.error('Error during check-in:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showLoading, close, showSuccess, showError, refreshReservations])

  const handleCheckOut = useCallback(async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Realizar Check-out?',
      text: 'El huésped será marcado como salido y la habitación quedará en limpieza.',
      confirmButtonText: 'Sí, Check-out',
    })

    if (!confirmed) return

    showLoading('Procesando check-out...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/checkout`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({})
      })

      close()

      if (response.ok) {
        await showSuccess('Check-out realizado', 'El huésped ha sido dado de salida exitosamente')
        refreshReservations()
      } else {
        const data = await response.json()
        await showError('Error al realizar check-out', data.message || 'No se pudo completar el check-out')
      }
    } catch (err) {
      close()
      console.error('Error during check-out:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showLoading, close, showSuccess, showError, refreshReservations])

  const handleCancel = useCallback(async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Cancelar reserva?',
      text: 'La reserva será cancelada y la habitación quedará disponible.',
      confirmButtonText: 'Sí, cancelar',
    })

    if (!confirmed) return

    showLoading('Cancelando reserva...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}/cancel`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason: 'Cancelada por el usuario' })
      })

      close()

      if (response.ok) {
        await showSuccess('Reserva cancelada', 'La reserva ha sido cancelada exitosamente')
        refreshReservations()
      } else {
        const data = await response.json()
        await showError('Error al cancelar', data.message || 'No se pudo cancelar la reserva')
      }
    } catch (err) {
      close()
      console.error('Error cancelling reservation:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showLoading, close, showSuccess, showError, refreshReservations])

  const handleDelete = useCallback(async (reservationId: string) => {
    const confirmed = await confirmDelete({
      title: '¿Eliminar reserva?',
      text: 'Esta acción no se puede deshacer. La reserva será eliminada permanentemente.',
    })

    if (!confirmed) return

    showLoading('Eliminando reserva...')

    try {
      const token = AuthService.getToken()
      if (!token) {
        close()
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/reservations/${reservationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })

      close()

      if (response.ok) {
        refreshReservations()
      } else {
        const data = await response.json()
        await showError('Error al eliminar', data.message || 'No se pudo eliminar la reserva')
      }
    } catch (err) {
      close()
      console.error('Error deleting reservation:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    }
  }, [confirmDelete, showLoading, close, showError, refreshReservations])

  return {
    handleConfirm,
    handleCheckIn,
    handleCheckOut,
    handleCancel,
    handleDelete
  }
}
