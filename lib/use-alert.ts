import { useState, useCallback } from 'react'

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface AlertState {
  open: boolean
  type: AlertType
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  showCancel?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}

const initialState: AlertState = {
  open: false,
  type: 'info',
  title: '',
  description: '',
  confirmText: 'Aceptar',
  cancelText: 'Cancelar',
  showCancel: false,
}

export const useAlert = () => {
  const [alertState, setAlertState] = useState<AlertState>(initialState)

  const showAlert = useCallback((config: Omit<AlertState, 'open'>) => {
    setAlertState({ ...config, open: true })
  }, [])

  const hideAlert = useCallback(() => {
    setAlertState(prev => ({ ...prev, open: false }))
  }, [])

  const showSuccess = useCallback((title: string, description?: string) => {
    return new Promise<void>((resolve) => {
      showAlert({
        type: 'success',
        title,
        description,
        confirmText: 'Aceptar',
        showCancel: false,
        onConfirm: () => resolve(),
      })
    })
  }, [showAlert])

  const showError = useCallback((title: string, description?: string) => {
    return new Promise<void>((resolve) => {
      showAlert({
        type: 'error',
        title,
        description,
        confirmText: 'Aceptar',
        showCancel: false,
        onConfirm: () => resolve(),
      })
    })
  }, [showAlert])

  const showWarning = useCallback((title: string, description?: string) => {
    return new Promise<void>((resolve) => {
      showAlert({
        type: 'warning',
        title,
        description,
        confirmText: 'Aceptar',
        showCancel: false,
        onConfirm: () => resolve(),
      })
    })
  }, [showAlert])

  const showInfo = useCallback((title: string, description?: string) => {
    return new Promise<void>((resolve) => {
      showAlert({
        type: 'info',
        title,
        description,
        confirmText: 'Aceptar',
        showCancel: false,
        onConfirm: () => resolve(),
      })
    })
  }, [showAlert])

  const confirmDelete = useCallback(({
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
    return new Promise((resolve) => {
      showAlert({
        type: 'warning',
        title,
        description: text,
        confirmText: confirmButtonText,
        cancelText: cancelButtonText,
        showCancel: true,
        onConfirm: () => resolve(true),
        onCancel: () => resolve(false),
      })
    })
  }, [showAlert])

  const showLoading = useCallback((title: string = 'Procesando...') => {
    showAlert({
      type: 'loading',
      title,
      showCancel: false,
    })
  }, [showAlert])

  const close = hideAlert

  return {
    alertState,
    showAlert,
    hideAlert,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    confirmDelete,
    showLoading,
    close,
  }
}
