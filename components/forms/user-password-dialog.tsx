"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthService } from "@/lib/auth"
import { Loader2, Key } from "lucide-react"

interface UserData {
  _id: string
  name: string
}

interface UserPasswordDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user?: UserData
}

export function UserPasswordDialog({ open, onOpenChange, onSuccess, user }: UserPasswordDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [formData, setFormData] = React.useState({
    newPassword: "",
    confirmPassword: ""
  })

  React.useEffect(() => {
    if (open) {
      setFormData({ newPassword: "", confirmPassword: "" })
      setError(null)
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    if (formData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`http://localhost:3000/api/users/${user._id}/reset-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newPassword: formData.newPassword })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(data.message || 'Error al actualizar la contraseña')
      }
    } catch (err) {
      console.error('Error updating password:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Cambiar Contraseña
          </DialogTitle>
          <DialogDescription>
            Establece una nueva contraseña para <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">Nueva Contraseña *</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Contraseña *</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Repite la contraseña"
              required
              minLength={6}
            />
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              La contraseña debe tener al menos 6 caracteres. El usuario podrá iniciar sesión con esta nueva contraseña inmediatamente.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Contraseña
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
