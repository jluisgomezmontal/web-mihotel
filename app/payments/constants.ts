import { Banknote, CreditCard, ArrowLeftRight, Clock, AlertCircle, CheckCircle } from "lucide-react"

export const PAYMENT_METHOD_LABELS = {
  cash: { label: 'Efectivo', icon: Banknote },
  card: { label: 'Tarjeta', icon: CreditCard },
  transfer: { label: 'Transferencia', icon: ArrowLeftRight }
} as const

export const PAYMENT_STATUS_LABELS = {
  pending: { label: 'Pendiente', variant: 'secondary' },
  partial: { label: 'Parcial', variant: 'default' },
  paid: { label: 'Pagado', variant: 'default' }
} as const

export const PAYMENT_METHOD_COLORS = {
  cash: { 
    color: 'text-[var(--payment-cash)]', 
    bg: 'bg-[var(--payment-cash-light)]', 
    border: 'border-[var(--payment-cash)]/20' 
  },
  card: { 
    color: 'text-[var(--payment-card)]', 
    bg: 'bg-[var(--payment-card-light)]', 
    border: 'border-[var(--payment-card)]/20' 
  },
  transfer: { 
    color: 'text-[var(--payment-transfer)]', 
    bg: 'bg-[var(--payment-transfer-light)]', 
    border: 'border-[var(--payment-transfer)]/20' 
  }
} as const

export const PAYMENT_STATUS_COLORS = {
  pending: { 
    color: 'text-[var(--payment-pending)]', 
    bg: 'bg-[var(--payment-pending-light)]', 
    border: 'border-[var(--payment-pending)]/20', 
    icon: Clock 
  },
  partial: { 
    color: 'text-[var(--payment-partial)]', 
    bg: 'bg-[var(--payment-partial-light)]', 
    border: 'border-[var(--payment-partial)]/20', 
    icon: AlertCircle 
  },
  paid: { 
    color: 'text-[var(--payment-paid)]', 
    bg: 'bg-[var(--payment-paid-light)]', 
    border: 'border-[var(--payment-paid)]/20', 
    icon: CheckCircle 
  }
} as const
