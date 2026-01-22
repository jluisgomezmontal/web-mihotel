import Swal from 'sweetalert2'

// Get CSS variable value
const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return ''
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim()
}

// Check if dark mode is active
const isDarkMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

export const useSweetAlert = () => {
  const confirmDelete = async ({
    title,
    text,
    confirmButtonText = 'Eliminar',
    cancelButtonText = 'Cancelar',
  }: {
    title: string
    text: string
    confirmButtonText?: string
    cancelButtonText?: string
  }): Promise<boolean> => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText,
      cancelButtonText,
      reverseButtons: true,
      background: `hsl(var(--card))`,
      color: `hsl(var(--card-foreground))`,
      backdrop: true,
      allowOutsideClick: true,
      customClass: {
        popup: 'swal2-themed-popup',
        confirmButton: 'swal2-themed-confirm',
        cancelButton: 'swal2-themed-cancel',
        title: 'swal2-themed-title',
        htmlContainer: 'swal2-themed-text',
        container: 'swal2-container',
      },
      didOpen: () => {
        const popup = Swal.getPopup()
        if (popup) {
          popup.style.borderColor = `hsl(var(--border))`
        }
      },
    })

    return result.isConfirmed
  }

  const showSuccess = async (title: string, text?: string) => {
    await Swal.fire({
      title,
      text,
      icon: 'success',
      confirmButtonText: 'Aceptar',
      background: `hsl(var(--card))`,
      color: `hsl(var(--card-foreground))`,
      backdrop: true,
      customClass: {
        popup: 'swal2-themed-popup',
        confirmButton: 'swal2-themed-primary',
        title: 'swal2-themed-title',
        htmlContainer: 'swal2-themed-text',
        container: 'swal2-container',
      },
      didOpen: () => {
        const popup = Swal.getPopup()
        if (popup) {
          popup.style.borderColor = `hsl(var(--border))`
        }
      },
    })
  }

  const showError = async (title: string, text?: string) => {
    await Swal.fire({
      title,
      text,
      icon: 'error',
      confirmButtonText: 'Aceptar',
      background: `hsl(var(--card))`,
      color: `hsl(var(--card-foreground))`,
      backdrop: true,
      customClass: {
        popup: 'swal2-themed-popup',
        confirmButton: 'swal2-themed-primary',
        title: 'swal2-themed-title',
        htmlContainer: 'swal2-themed-text',
        container: 'swal2-container',
      },
      didOpen: () => {
        const popup = Swal.getPopup()
        if (popup) {
          popup.style.backgroundColor = `hsl(var(--card))`
          popup.style.borderColor = `hsl(var(--border))`
        }
      },
    })
  }

  const showLoading = (title: string = 'Procesando...') => {
    Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: `hsl(var(--card))`,
      color: `hsl(var(--card-foreground))`,
      backdrop: true,
      customClass: {
        popup: 'swal2-themed-popup',
        title: 'swal2-themed-title',
        container: 'swal2-container',
      },
      didOpen: () => {
        Swal.showLoading()
        const popup = Swal.getPopup()
        if (popup) {
          popup.style.borderColor = `hsl(var(--border))`
        }
      },
    })
  }

  const close = () => {
    Swal.close()
  }

  return {
    confirmDelete,
    showSuccess,
    showError,
    showLoading,
    close,
  }
}
