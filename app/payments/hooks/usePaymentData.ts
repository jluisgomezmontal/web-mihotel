import { useState, useCallback, useEffect } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { useAlert } from '@/lib/use-alert'
import type { Payment, Reservation } from '../types'

export function usePaymentData() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { showError } = useAlert()

  const loadPayments = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`${API_BASE_URL}/payments?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPayments(data.data?.payments || [])
      } else {
        await showError('Error al cargar', 'No se pudieron cargar los pagos')
      }
    } catch (err) {
      console.error('Error loading payments:', err)
      await showError('Error de conexión', 'No se pudo conectar con el servidor')
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  const loadReservations = useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/reservations?limit=200`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const data = await response.json()
        const reservationsWithBalance = (data.data?.reservations || []).filter(
          (r: Reservation) => r.paymentSummary?.remainingBalance > 0
        )
        setReservations(reservationsWithBalance)
      }
    } catch (err) {
      console.error('Error loading reservations:', err)
    }
  }, [])

  useEffect(() => {
    loadPayments()
    loadReservations()
  }, [loadPayments, loadReservations])

  return {
    payments,
    reservations,
    isLoading,
    loadPayments,
    loadReservations
  }
}
