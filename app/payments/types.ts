export interface Payment {
  _id: string
  transactionId: string
  amount: number
  currency: string
  method: string
  status: string
  paymentDate: string
  notes?: string
  reservationId: {
    _id: string
    confirmationNumber: string
    guestId: {
      firstName: string
      lastName: string
      email: string
    }
    roomId: {
      nameOrNumber: string
    }
    propertyId: {
      name: string
    }
  }
  refund: {
    isRefunded: boolean
    refundedAmount: number
    refundReason?: string
  }
  details?: {
    cardLast4?: string
    cardBrand?: string
    transferReference?: string
    bankName?: string
  }
}

export interface Reservation {
  _id: string
  confirmationNumber: string
  guestId: {
    firstName: string
    lastName: string
  }
  pricing: {
    totalPrice: number
  }
  paymentSummary: {
    totalPaid: number
    remainingBalance: number
  }
}

export interface PaymentStats {
  total: number
  totalAmount: number
  totalRefunded: number
  netAmount: number
  byMethod: {
    cash: number
    card: number
    transfer: number
  }
}

export interface PaymentCardProps {
  payment: Payment
  onRefund: (payment: Payment) => void
  onViewDetails: (payment: Payment) => void
}
