import { Lock, Key, Shield, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import type { SecurityFormData } from "../types"

interface SecurityTabProps {
  securityForm: SecurityFormData
  onSecurityFormChange: (form: SecurityFormData) => void
  onSubmit: (e: React.FormEvent) => void
  isSaving: boolean
  showCurrentPassword: boolean
  showNewPassword: boolean
  showConfirmPassword: boolean
  onToggleCurrentPassword: () => void
  onToggleNewPassword: () => void
  onToggleConfirmPassword: () => void
}

export function SecurityTab({
  securityForm,
  onSecurityFormChange,
  onSubmit,
  isSaving,
  showCurrentPassword,
  showNewPassword,
  showConfirmPassword,
  onToggleCurrentPassword,
  onToggleNewPassword,
  onToggleConfirmPassword
}: SecurityTabProps) {
  return (
    <div className="space-y-6">
      <Card className="border-2 border-primary/10 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Cambiar Contraseña
          </CardTitle>
          <CardDescription>
            Actualiza tu contraseña para mantener tu cuenta segura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="flex items-center gap-2">
                  <Key className="h-4 w-4" />
                  Contraseña Actual
                </Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={securityForm.currentPassword}
                    onChange={(e) => onSecurityFormChange({ ...securityForm, currentPassword: e.target.value })}
                    placeholder="Ingresa tu contraseña actual"
                    className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={onToggleCurrentPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={securityForm.newPassword}
                    onChange={(e) => onSecurityFormChange({ ...securityForm, newPassword: e.target.value })}
                    placeholder="Mínimo 6 caracteres"
                    className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={onToggleNewPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Confirmar Nueva Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={securityForm.confirmPassword}
                    onChange={(e) => onSecurityFormChange({ ...securityForm, confirmPassword: e.target.value })}
                    placeholder="Confirma tu nueva contraseña"
                    className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                  />
                  <button
                    type="button"
                    onClick={onToggleConfirmPassword}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
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
                    Actualizando...
                  </>
                ) : (
                  <>
                    <Lock className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    Cambiar Contraseña
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-primary/10">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Consejos de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-[var(--dashboard-success)] mt-0.5 flex-shrink-0" />
            <span>Usa una contraseña única y compleja</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-[var(--dashboard-success)] mt-0.5 flex-shrink-0" />
            <span>Cambia tu contraseña regularmente</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-[var(--dashboard-success)] mt-0.5 flex-shrink-0" />
            <span>No compartas tu contraseña con nadie</span>
          </div>
          <div className="flex items-start gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-[var(--dashboard-success)] mt-0.5 flex-shrink-0" />
            <span>Cierra sesión en dispositivos compartidos</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
