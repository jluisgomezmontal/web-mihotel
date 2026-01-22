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
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthService } from "@/lib/auth"
import { Loader2, Shield } from "lucide-react"

interface UserData {
  _id: string
  name: string
  role: 'admin' | 'staff' | 'cleaning'
}

interface UserRoleDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user?: UserData
}

export function UserRoleDialog({ open, onOpenChange, onSuccess, user }: UserRoleDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [selectedRole, setSelectedRole] = React.useState<string>(user?.role || 'staff')

  React.useEffect(() => {
    if (open && user) {
      setSelectedRole(user.role)
      setError(null)
    }
  }, [open, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const response = await fetch(`http://localhost:3000/api/users/${user._id}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(data.message || 'Error al actualizar el rol')
      }
    } catch (err) {
      console.error('Error updating role:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Acceso completo al sistema, puede gestionar usuarios, propiedades, reservas y ver reportes.'
      case 'staff':
        return 'Puede gestionar reservas y huéspedes. No puede gestionar usuarios ni propiedades.'
      case 'cleaning':
        return 'Acceso limitado solo a funciones de limpieza y mantenimiento de habitaciones.'
      default:
        return ''
    }
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Cambiar Rol de Usuario
          </DialogTitle>
          <DialogDescription>
            Cambia el rol de <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="role">Nuevo Rol</Label>
            <Select 
              value={selectedRole} 
              onValueChange={setSelectedRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar rol..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="cleaning">Limpieza</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-muted p-3 rounded-md">
            <p className="text-sm text-muted-foreground">
              {getRoleDescription(selectedRole)}
            </p>
          </div>

          {selectedRole === 'admin' && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ Advertencia:</strong> Los administradores tienen acceso completo al sistema.
              </p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || selectedRole === user.role}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Actualizar Rol
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
