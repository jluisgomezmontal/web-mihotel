/**
 * Theme utilities for consistent color mapping across the application
 * Uses CSS variables from globals.css to ensure theme compatibility
 */

export const statusColors = {
  // Room status colors
  room: {
    available: 'bg-primary/10 text-primary border-primary/20',
    occupied: 'bg-destructive/10 text-destructive border-destructive/20',
    reserved: 'bg-accent text-accent-foreground border-accent/20',
    maintenance: 'bg-muted text-muted-foreground border-border',
    cleaning: 'bg-secondary text-secondary-foreground border-border',
  },
  
  // Reservation status colors
  reservation: {
    pending: 'bg-secondary text-secondary-foreground',
    confirmed: 'bg-accent text-accent-foreground',
    checked_in: 'bg-primary text-primary-foreground',
    checked_out: 'bg-muted text-muted-foreground',
    cancelled: 'bg-destructive text-destructive-foreground',
  },
  
  // User role colors
  role: {
    admin: 'bg-primary hover:bg-primary/90',
    staff: 'bg-accent hover:bg-accent/90',
    cleaning: 'bg-secondary hover:bg-secondary/90',
  },
  
  // Alert/notification types
  alert: {
    success: {
      icon: 'text-primary',
      bg: 'bg-primary/10',
      border: 'border-primary/20',
    },
    error: {
      icon: 'text-destructive',
      bg: 'bg-destructive/10',
      border: 'border-destructive/20',
    },
    warning: {
      icon: 'text-secondary-foreground',
      bg: 'bg-secondary',
      border: 'border-border',
    },
    info: {
      icon: 'text-accent-foreground',
      bg: 'bg-accent/10',
      border: 'border-accent/20',
    },
  },
}

// Status indicator bar colors (top border)
export const getStatusBarColor = (status: string, type: 'room' | 'reservation' | 'guest' = 'room') => {
  if (type === 'room') {
    switch (status) {
      case 'available': return 'bg-primary'
      case 'occupied': return 'bg-destructive'
      case 'reserved': return 'bg-accent'
      case 'maintenance': return 'bg-muted-foreground'
      case 'cleaning': return 'bg-secondary'
      default: return 'bg-border'
    }
  }
  
  if (type === 'reservation') {
    switch (status) {
      case 'confirmed': return 'bg-accent'
      case 'checked_in': return 'bg-primary'
      case 'checked_out': return 'bg-muted'
      case 'cancelled': return 'bg-destructive'
      default: return 'bg-secondary'
    }
  }
  
  if (type === 'guest') {
    // For guest cards with special statuses
    return 'bg-primary'
  }
  
  return 'bg-border'
}

// Action button colors
export const actionButtons = {
  checkIn: 'bg-primary hover:bg-primary/90',
  checkOut: 'bg-accent hover:bg-accent/90',
  confirm: 'bg-primary hover:bg-primary/90',
  cancel: 'bg-destructive hover:bg-destructive/90',
  edit: 'bg-secondary hover:bg-secondary/90',
}

// Stats/metrics colors
export const statsColors = {
  available: {
    dot: 'bg-primary',
    text: 'text-primary',
  },
  occupied: {
    dot: 'bg-destructive',
    text: 'text-destructive',
  },
  total: {
    dot: 'bg-accent',
    text: 'text-accent-foreground',
  },
}
