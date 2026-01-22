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
import { PhoneInput } from "@/components/ui/phone-input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AuthService } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface UserData {
  _id?: string
  name: string
  email: string
  role: 'admin' | 'staff' | 'cleaning'
  profile?: {
    phone?: string
    timezone?: string
  }
}

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  user?: UserData
}

export function UserFormDialog({ open, onOpenChange, onSuccess, user }: UserFormDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const isEditMode = !!user
  
  const getInitialFormData = React.useCallback(() => user ? {
    name: user.name,
    email: user.email,
    password: "",
    role: user.role,
    phone: user.profile?.phone || "",
    timezone: user.profile?.timezone || "America/Mexico_City",
  } : {
    name: "",
    email: "",
    password: "",
    role: "staff" as const,
    phone: "",
    timezone: "America/Mexico_City",
  }, [user])
  
  const [formData, setFormData] = React.useState(getInitialFormData())

  React.useEffect(() => {
    if (open) {
      setFormData(getInitialFormData())
      setError(null)
    }
  }, [open, getInitialFormData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const token = AuthService.getToken()
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const url = isEditMode 
        ? `http://localhost:3000/api/users/${user._id}`
        : 'http://localhost:3000/api/users'
      
      const method = isEditMode ? 'PUT' : 'POST'

      const payload: any = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        profile: {
          phone: formData.phone || undefined,
          timezone: formData.timezone,
        },
      }

      if (!isEditMode && formData.password) {
        payload.password = formData.password
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (response.ok) {
        onSuccess()
        onOpenChange(false)
      } else {
        setError(data.message || `Error al ${isEditMode ? 'actualizar' : 'crear'} el usuario`)
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} user:`, err)
      setError('Error de conexión con el servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditMode ? 'Editar Usuario' : 'Nuevo Usuario'}</DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? 'Actualiza la información del usuario'
              : 'Completa la información para crear un nuevo usuario'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Información Básica</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="name">Nombre Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Juan Pérez García"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="juan@ejemplo.com"
                    required
                    disabled={isEditMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <PhoneInput
                    id="phone"
                    value={formData.phone}
                    onChange={(value) => updateField('phone', value)}
                  />
                </div>
                {!isEditMode && (
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="password">Contraseña *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => updateField('password', e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      required={!isEditMode}
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      La contraseña debe tener al menos 6 caracteres
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="border-b pb-4">
              <h3 className="font-semibold mb-3">Rol y Configuración</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Rol *</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => updateField('role', value)}
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
                  <p className="text-xs text-muted-foreground">
                    {formData.role === 'admin' && 'Acceso completo al sistema'}
                    {formData.role === 'staff' && 'Gestión de reservas y huéspedes'}
                    {formData.role === 'cleaning' && 'Acceso limitado a limpieza'}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select 
                    value={formData.timezone} 
                    onValueChange={(value) => updateField('timezone', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                      <SelectItem value="America/Cancun">Cancún (GMT-5)</SelectItem>
                      <SelectItem value="America/Tijuana">Tijuana (GMT-8)</SelectItem>
                      <SelectItem value="America/Monterrey">Monterrey (GMT-6)</SelectItem>
                      <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                      <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                      <SelectItem value="America/Chicago">Chicago (GMT-6)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {isEditMode && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Nota:</strong> Para cambiar el rol o permisos del usuario, usa los botones específicos en la tarjeta del usuario.
                  Para cambiar la contraseña, usa el botón de resetear contraseña.
                </p>
              </div>
            )}
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
              {isEditMode ? 'Actualizar Usuario' : 'Crear Usuario'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
