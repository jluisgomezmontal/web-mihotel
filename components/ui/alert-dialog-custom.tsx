"use client"

import React from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { CheckCircle, XCircle, AlertTriangle, Info, Loader2 } from 'lucide-react'

export type AlertType = 'success' | 'error' | 'warning' | 'info' | 'loading'

interface AlertDialogCustomProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  type: AlertType
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
}

const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
  loading: Loader2,
}

const colorMap = {
  success: {
    icon: 'text-green-600 dark:text-green-500',
    bg: 'bg-green-50 dark:bg-green-950/20',
    border: 'border-green-200 dark:border-green-800',
  },
  error: {
    icon: 'text-destructive',
    bg: 'bg-destructive/10',
    border: 'border-destructive/20',
  },
  warning: {
    icon: 'text-yellow-600 dark:text-yellow-500',
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    border: 'border-yellow-200 dark:border-yellow-800',
  },
  info: {
    icon: 'text-blue-600 dark:text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-200 dark:border-blue-800',
  },
  loading: {
    icon: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
}

export function AlertDialogCustom({
  open,
  onOpenChange,
  type,
  title,
  description,
  confirmText = 'Aceptar',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
  showCancel = false,
}: AlertDialogCustomProps) {
  const Icon = iconMap[type]
  const colors = colorMap[type]

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onOpenChange(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colors.bg} ${colors.border} border-2`}>
            <Icon className={`h-8 w-8 ${colors.icon} ${type === 'loading' ? 'animate-spin' : ''}`} />
          </div>
          <AlertDialogTitle className="text-center text-xl">
            {title}
          </AlertDialogTitle>
          {description && (
            <AlertDialogDescription className="text-center whitespace-pre-line leading-relaxed">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {type !== 'loading' && (
          <AlertDialogFooter className="sm:justify-center gap-2">
            {showCancel && (
              <AlertDialogCancel onClick={handleCancel}>
                {cancelText}
              </AlertDialogCancel>
            )}
            <AlertDialogAction onClick={handleConfirm}>
              {confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  )
}
