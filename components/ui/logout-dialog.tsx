"use client"

import * as React from "react"
import { LogOut, AlertTriangle, Loader2 } from "lucide-react"
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
import { Button } from "@/components/ui/button"

interface LogoutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
  isLoading?: boolean
}

export function LogoutDialog({ open, onOpenChange, onConfirm, isLoading = false }: LogoutDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--dashboard-warning-light)] border-2 border-[var(--dashboard-warning)]/20">
              <AlertTriangle className="h-6 w-6 text-[var(--dashboard-warning)]" />
            </div>
            <AlertDialogTitle className="text-xl">
              Cerrar Sesión
            </AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base">
            ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-2">
          <AlertDialogCancel 
            disabled={isLoading}
            className="hover:scale-105 transition-transform"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault()
              onConfirm()
            }}
            disabled={isLoading}
            className="bg-[var(--dashboard-danger)] hover:bg-[var(--dashboard-danger)]/90 hover:scale-105 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cerrando...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
