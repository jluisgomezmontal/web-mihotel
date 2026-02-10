import { useMemo } from 'react'
import type { Payment, PaymentStats } from '../types'

export function usePaymentFilters(
  payments: Payment[],
  searchTerm: string,
  filterMethod: string,
  filterStatus: string
) {
  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      const matchesSearch = 
        payment.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.reservationId.confirmationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${payment.reservationId.guestId.firstName} ${payment.reservationId.guestId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesMethod = filterMethod === "all" || payment.method === filterMethod
      const matchesStatus = filterStatus === "all" || payment.status === filterStatus

      return matchesSearch && matchesMethod && matchesStatus
    })
  }, [payments, searchTerm, filterMethod, filterStatus])

  const stats = useMemo<PaymentStats>(() => {
    const total = payments.length
    const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalRefunded = payments.reduce((sum, p) => sum + p.refund.refundedAmount, 0)
    const netAmount = totalAmount - totalRefunded
    const byMethod = {
      cash: payments.filter(p => p.method === 'cash').reduce((sum, p) => sum + p.amount, 0),
      card: payments.filter(p => p.method === 'card').reduce((sum, p) => sum + p.amount, 0),
      transfer: payments.filter(p => p.method === 'transfer').reduce((sum, p) => sum + p.amount, 0)
    }

    return { total, totalAmount, totalRefunded, netAmount, byMethod }
  }, [payments])

  return {
    filteredPayments,
    stats
  }
}
