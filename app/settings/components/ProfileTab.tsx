import { User, Mail, Phone, Clock, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { ProfileFormData } from "../types"

interface ProfileTabProps {
  profileForm: ProfileFormData
  onProfileFormChange: (form: ProfileFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isSaving: boolean
  userData: any
}

export function ProfileTab({ profileForm, onProfileFormChange, onSubmit, isSaving, userData }: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Información Personal
          </CardTitle>
          <CardDescription>
            Actualiza tu información de perfil y preferencias personales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Nombre Completo
                </Label>
                <Input
                  id="name"
                  value={profileForm.name}
                  onChange={(e) => onProfileFormChange({ ...profileForm, name: e.target.value })}
                  placeholder="Tu nombre completo"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  disabled
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-xs text-muted-foreground">
                  El correo no puede ser modificado
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Teléfono
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => onProfileFormChange({ ...profileForm, phone: e.target.value })}
                  placeholder="+52 123 456 7890"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Zona Horaria
                </Label>
                <Select
                  value={profileForm.timezone}
                  onValueChange={(value) => onProfileFormChange({ ...profileForm, timezone: value })}
                >
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Mexico_City">Ciudad de México (GMT-6)</SelectItem>
                    <SelectItem value="America/Cancun">Cancún (GMT-5)</SelectItem>
                    <SelectItem value="America/Monterrey">Monterrey (GMT-6)</SelectItem>
                    <SelectItem value="America/Tijuana">Tijuana (GMT-8)</SelectItem>
                    <SelectItem value="America/New_York">Nueva York (GMT-5)</SelectItem>
                    <SelectItem value="America/Los_Angeles">Los Ángeles (GMT-8)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <Button
                type="submit"
                disabled={isSaving}
                className="group hover:scale-105 transition-all duration-300"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">Información de la Cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">Rol</span>
            <Badge variant="outline" className="font-semibold">
              {userData?.role === 'admin' ? 'Administrador' : userData?.role === 'staff' ? 'Personal' : 'Limpieza'}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <span className="text-sm font-medium">Miembro desde</span>
            <span className="text-sm text-muted-foreground">
              {userData?.createdAt ? new Date(userData.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'N/A'}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
