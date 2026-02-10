import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"

export const RESERVATION_STATUS_CONFIG = {
  pending: { 
    icon: Clock, 
    color: 'text-[var(--dashboard-warning)]', 
    bg: 'bg-[var(--dashboard-warning-light)]',
    border: 'border-[var(--dashboard-warning)]/20',
    label: 'Pendiente' 
  },
  confirmed: { 
    icon: CheckCircle, 
    color: 'text-[var(--dashboard-success)]', 
    bg: 'bg-[var(--dashboard-success-light)]',
    border: 'border-[var(--dashboard-success)]/20',
    label: 'Confirmada' 
  },
  checked_in: { 
    icon: CheckCircle, 
    color: 'text-[var(--dashboard-info)]', 
    bg: 'bg-[var(--dashboard-info-light)]',
    border: 'border-[var(--dashboard-info)]/20',
    label: 'Check-in' 
  },
  checked_out: { 
    icon: XCircle, 
    color: 'text-muted-foreground', 
    bg: 'bg-muted',
    border: 'border-border',
    label: 'Check-out' 
  }
} as const

export const KPI_VARIANT_STYLES = {
  success: {
    card: 'border-[var(--dashboard-success)]/20 bg-gradient-to-br from-[var(--gradient-success-from)]/10 to-[var(--gradient-success-to)]/5 hover:from-[var(--gradient-success-from)]/15 hover:to-[var(--gradient-success-to)]/10',
    icon: 'text-[var(--dashboard-success)] bg-[var(--dashboard-success-light)] group-hover:scale-110'
  },
  warning: {
    card: 'border-[var(--dashboard-warning)]/20 bg-gradient-to-br from-[var(--gradient-warning-from)]/10 to-[var(--gradient-warning-to)]/5 hover:from-[var(--gradient-warning-from)]/15 hover:to-[var(--gradient-warning-to)]/10',
    icon: 'text-[var(--dashboard-warning)] bg-[var(--dashboard-warning-light)] group-hover:scale-110'
  },
  info: {
    card: 'border-[var(--dashboard-info)]/20 bg-gradient-to-br from-[var(--gradient-info-from)]/10 to-[var(--gradient-info-to)]/5 hover:from-[var(--gradient-info-from)]/15 hover:to-[var(--gradient-info-to)]/10',
    icon: 'text-[var(--dashboard-info)] bg-[var(--dashboard-info-light)] group-hover:scale-110'
  },
  danger: {
    card: 'border-[var(--dashboard-danger)]/20 bg-gradient-to-br from-[var(--dashboard-danger)]/10 to-[var(--dashboard-danger-light)]/5 hover:from-[var(--dashboard-danger)]/15 hover:to-[var(--dashboard-danger-light)]/10',
    icon: 'text-[var(--dashboard-danger)] bg-[var(--dashboard-danger-light)] group-hover:scale-110'
  },
  default: {
    card: 'bg-gradient-to-br from-[var(--gradient-primary-from)]/10 to-[var(--gradient-primary-to)]/5 hover:from-[var(--gradient-primary-from)]/15 hover:to-[var(--gradient-primary-to)]/10',
    icon: 'text-primary bg-primary/10 group-hover:scale-110'
  }
} as const
