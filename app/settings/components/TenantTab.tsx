import { Building2, Globe, DollarSign, Clock, Languages, Save, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { TenantFormData, TenantData } from "../types"

interface TenantTabProps {
  tenantForm: TenantFormData
  onTenantFormChange: (form: TenantFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isSaving: boolean
  userData: any
  tenant: TenantData | null
}

export function TenantTab({ tenantForm, onTenantFormChange, onSubmit, isSaving, userData, tenant }: TenantTabProps) {
  const isAdmin = userData?.role === 'admin'

  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Información de la Organización
          </CardTitle>
          <CardDescription>
            Configura los detalles de tu negocio y preferencias regionales
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tenantName" className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Nombre del Negocio
                </Label>
                <Input
                  id="tenantName"
                  value={tenantForm.name}
                  onChange={(e) => onTenantFormChange({ ...tenantForm, name: e.target.value })}
                  placeholder="Nombre de tu hotel o negocio"
                  className="transition-all focus:ring-2 focus:ring-primary/20"
                  disabled={!isAdmin}
                />
                {!isAdmin && (
                  <p className="text-xs text-muted-foreground">
                    Solo administradores pueden modificar este campo
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantType" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Tipo de Negocio
                </Label>
                <Select
                  value={tenantForm.type}
                  onValueChange={(value: 'hotel' | 'airbnb' | 'posada') => onTenantFormChange({ ...tenantForm, type: value })}
                  disabled={!isAdmin}
                >
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hotel">Hotel</SelectItem>
                    <SelectItem value="airbnb">Airbnb</SelectItem>
                    <SelectItem value="posada">Posada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="currency" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Moneda
                </Label>
                <Select
                  value={tenantForm.currency}
                  onValueChange={(value) => onTenantFormChange({ ...tenantForm, currency: value })}
                  disabled={!isAdmin}
                >
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - Dólar Estadounidense</SelectItem>
                    <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - Libra Esterlina</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tenantTimezone" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Zona Horaria del Negocio
                </Label>
                <Select
                  value={tenantForm.timezone}
                  onValueChange={(value) => onTenantFormChange({ ...tenantForm, timezone: value })}
                  disabled={!isAdmin}
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

              <div className="space-y-2">
                <Label htmlFor="language" className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  Idioma
                </Label>
                <Select
                  value={tenantForm.language}
                  onValueChange={(value) => onTenantFormChange({ ...tenantForm, language: value })}
                  disabled={!isAdmin}
                >
                  <SelectTrigger className="transition-all focus:ring-2 focus:ring-primary/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isAdmin && (
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
                      Guardar Configuración
                    </>
                  )}
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {tenant && (
        <Card className="border-none shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Información de Suscripción</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <span className="text-sm font-medium">Plan Actual</span>
              <Badge className="font-semibold bg-primary">
                {tenant.plan === 'basic' ? 'Básico' : tenant.plan === 'premium' ? 'Premium' : 'Enterprise'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Estado</span>
              <Badge 
                variant="outline" 
                className={cn(
                  "font-semibold",
                  tenant.subscription.isTrialActive 
                    ? "text-[var(--dashboard-warning)] border-[var(--dashboard-warning)]/30" 
                    : "text-[var(--dashboard-success)] border-[var(--dashboard-success)]/30"
                )}
              >
                {tenant.subscription.isTrialActive ? 'Prueba Activa' : 'Activo'}
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <span className="text-sm font-medium">Fecha de Inicio</span>
              <span className="text-sm text-muted-foreground">
                {new Date(tenant.subscription.startDate).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
