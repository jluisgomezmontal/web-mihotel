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
import { Switch } from "@/components/ui/switch"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { Loader2, UserCog, Building2, Users, Calendar, BarChart3 } from "lucide-react"

interface UserData {
  _id: string
  name: string
  permissions: {
    canManageProperties: boolean
    canManageUsers: boolean
    canManageReservations: boolean
    canViewReports: boolean
  }
}

interface UserPermissionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user?: UserData
}

export function UserPermissionsDialog({ open, onOpenChange, onSuccess, user }: UserPermissionsDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [permissions, setPermissions] = React.useState({
    canManageProperties: false,
    canManageUsers: false,
    canManageReservations: false,
    canViewReports: false,
  })

  React.useEffect(() => {
    if (open && user) {
      setPermissions(user.permissions)
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

      const response = await fetch(`${API_BASE_URL}/users/${user._id}/permissions`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ permissions })
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(data.message || 'Error al actualizar los permisos')
      }
    } catch (err) {
      console.error('Error updating permissions:', err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const togglePermission = (key: keyof typeof permissions) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }))
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCog className="h-5 w-5" />
            Gestionar Permisos
          </DialogTitle>
          <DialogDescription>
            Configura los permisos de <strong>{user.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="canManageProperties" className="cursor-pointer">
                    Gestionar Propiedades
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Crear, editar y eliminar propiedades y habitaciones
                  </p>
                </div>
              </div>
              <Switch
                id="canManageProperties"
                checked={permissions.canManageProperties}
                onCheckedChange={() => togglePermission('canManageProperties')}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="canManageUsers" className="cursor-pointer">
                    Gestionar Usuarios
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Crear, editar y eliminar usuarios del sistema
                  </p>
                </div>
              </div>
              <Switch
                id="canManageUsers"
                checked={permissions.canManageUsers}
                onCheckedChange={() => togglePermission('canManageUsers')}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="canManageReservations" className="cursor-pointer">
                    Gestionar Reservas
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Crear, editar y cancelar reservas
                  </p>
                </div>
              </div>
              <Switch
                id="canManageReservations"
                checked={permissions.canManageReservations}
                onCheckedChange={() => togglePermission('canManageReservations')}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <Label htmlFor="canViewReports" className="cursor-pointer">
                    Ver Reportes
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    Acceso a reportes y estadísticas del negocio
                  </p>
                </div>
              </div>
              <Switch
                id="canViewReports"
                checked={permissions.canViewReports}
                onCheckedChange={() => togglePermission('canViewReports')}
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Nota:</strong> Los permisos se aplicarán inmediatamente después de guardar.
            </p>
          </div>

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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Permisos
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
