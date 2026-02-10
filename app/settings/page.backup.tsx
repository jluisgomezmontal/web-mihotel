"use client"

import * as React from "react"
import { 
  User, 
  Lock, 
  Building2, 
  Globe, 
  Bell, 
  Sparkles,
  Save,
  Loader2,
  Mail,
  Phone,
  Clock,
  DollarSign,
  Languages,
  Shield,
  Key,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import { cn } from '@/lib/utils'
import { useDashboard } from "@/contexts/DashboardContext"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface TenantData {
  _id: string
  name: string
  type: 'hotel' | 'airbnb' | 'posada'
  plan: 'basic' | 'premium' | 'enterprise'
  settings: {
    currency: string
    timezone: string
    language: string
  }
  subscription: {
    startDate: string
    endDate?: string
    isTrialActive: boolean
  }
  createdAt: string
}

export default function SettingsPage() {
  const { userData, tenantData, refreshAll } = useDashboard()
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("profile")
  const [tenant, setTenant] = React.useState<TenantData | null>(null)
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Profile form state
  const [profileForm, setProfileForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    timezone: ""
  })

  // Security form state
  const [securityForm, setSecurityForm] = React.useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  // Tenant settings form state
  const [tenantForm, setTenantForm] = React.useState({
    name: "",
    type: "hotel" as 'hotel' | 'airbnb' | 'posada',
    currency: "USD",
    timezone: "America/Mexico_City",
    language: "es"
  })

  // Load tenant data
  React.useEffect(() => {
    const fetchTenantData = async () => {
      try {
        setIsLoading(true)
        const token = AuthService.getToken()
        if (!token) return

        const response = await fetch(`${API_BASE_URL}/tenants/current`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const data = await response.json()
          setTenant(data.data.tenant)
          setTenantForm({
            name: data.data.tenant.name,
            type: data.data.tenant.type,
            currency: data.data.tenant.settings.currency,
            timezone: data.data.tenant.settings.timezone,
            language: data.data.tenant.settings.language
          })
        }
      } catch (error) {
        console.error('Error fetching tenant data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTenantData()
  }, [])

  // Load user profile data
  React.useEffect(() => {
    if (userData) {
      setProfileForm({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.profile?.phone || "",
        timezone: userData.profile?.timezone || "America/Mexico_City"
      })
    }
  }, [userData])

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const token = AuthService.getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: profileForm.name,
          profile: {
            phone: profileForm.phone,
            timezone: profileForm.timezone
          }
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('Perfil actualizado correctamente')
        await refreshAll()
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage(data.message || 'Error al actualizar el perfil')
      }
    } catch (error) {
      console.error('Profile update error:', error)
      setErrorMessage('Error al actualizar el perfil')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    if (securityForm.newPassword !== securityForm.confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden')
      setIsSaving(false)
      return
    }

    if (securityForm.newPassword.length < 6) {
      setErrorMessage('La contraseña debe tener al menos 6 caracteres')
      setIsSaving(false)
      return
    }

    try {
      const token = AuthService.getToken()
      if (!token) throw new Error('No authentication token')

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: securityForm.currentPassword,
          newPassword: securityForm.newPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccessMessage('Contraseña actualizada correctamente')
        setSecurityForm({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        setErrorMessage(data.message || 'Error al cambiar la contraseña')
      }
    } catch (error) {
      console.error('Password change error:', error)
      setErrorMessage('Error al cambiar la contraseña')
    } finally {
      setIsSaving(false)
    }
  }

  // Handle tenant settings update
  const handleTenantUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const token = AuthService.getToken()
      if (!token) throw new Error('No authentication token')

      // Update tenant info
      const infoResponse = await fetch(`${API_BASE_URL}/tenants/info`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: tenantForm.name,
          type: tenantForm.type
        })
      })

      // Update tenant settings
      const settingsResponse = await fetch(`${API_BASE_URL}/tenants/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          settings: {
            currency: tenantForm.currency,
            timezone: tenantForm.timezone,
            language: tenantForm.language
          }
        })
      })

      if (infoResponse.ok && settingsResponse.ok) {
        setSuccessMessage('Configuración actualizada correctamente')
        await refreshAll()
        setTimeout(() => setSuccessMessage(null), 3000)
      } else {
        const data = await settingsResponse.json()
        setErrorMessage(data.message || 'Error al actualizar la configuración')
      }
    } catch (error) {
      console.error('Tenant update error:', error)
      setErrorMessage('Error al actualizar la configuración')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout 
        user={userData || { name: "Cargando...", email: "", role: "admin" }}
        tenant={tenantData || { name: "Cargando...", type: "hotel" }}
      >
        <DashboardSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout 
      user={userData || { name: "Usuario", email: "", role: "admin" }}
      tenant={tenantData || { name: "Tenant", type: "hotel" }}
    >
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Configuración
              </h1>
              <Sparkles className="h-6 w-6 text-primary animate-pulse" />
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona tu perfil, seguridad y preferencias del sistema
            </p>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-[var(--dashboard-success-light)] border border-[var(--dashboard-success)]/20 animate-in fade-in slide-in-from-top-2">
            <CheckCircle className="h-5 w-5 text-[var(--dashboard-success)]" />
            <span className="text-sm font-medium text-[var(--dashboard-success)]">{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 p-4 rounded-lg bg-[var(--dashboard-danger-light)] border border-[var(--dashboard-danger)]/20 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-5 w-5 text-[var(--dashboard-danger)]" />
            <span className="text-sm font-medium text-[var(--dashboard-danger)]">{errorMessage}</span>
          </div>
        )}

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Perfil</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              <span className="hidden sm:inline">Seguridad</span>
            </TabsTrigger>
            <TabsTrigger value="tenant" className="gap-2">
              <Building2 className="h-4 w-4" />
              <span className="hidden sm:inline">Organización</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
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
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Nombre Completo
                      </Label>
                      <Input
                        id="name"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
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
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
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
                        onValueChange={(value) => setProfileForm({ ...profileForm, timezone: value })}
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

            {/* User Info Card */}
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
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
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
                <form onSubmit={handlePasswordChange} className="space-y-6">
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
                          onChange={(e) => setSecurityForm({ ...securityForm, currentPassword: e.target.value })}
                          placeholder="Ingresa tu contraseña actual"
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
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
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          placeholder="Mínimo 6 caracteres"
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
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
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          placeholder="Confirma tu nueva contraseña"
                          className="pr-10 transition-all focus:ring-2 focus:ring-primary/20"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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

            {/* Security Tips */}
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
          </TabsContent>

          {/* Tenant Tab */}
          <TabsContent value="tenant" className="space-y-6">
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
                <form onSubmit={handleTenantUpdate} className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tenantName" className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        Nombre del Negocio
                      </Label>
                      <Input
                        id="tenantName"
                        value={tenantForm.name}
                        onChange={(e) => setTenantForm({ ...tenantForm, name: e.target.value })}
                        placeholder="Nombre de tu hotel o negocio"
                        className="transition-all focus:ring-2 focus:ring-primary/20"
                        disabled={userData?.role !== 'admin'}
                      />
                      {userData?.role !== 'admin' && (
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
                        onValueChange={(value: 'hotel' | 'airbnb' | 'posada') => setTenantForm({ ...tenantForm, type: value })}
                        disabled={userData?.role !== 'admin'}
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
                        onValueChange={(value) => setTenantForm({ ...tenantForm, currency: value })}
                        disabled={userData?.role !== 'admin'}
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
                        onValueChange={(value) => setTenantForm({ ...tenantForm, timezone: value })}
                        disabled={userData?.role !== 'admin'}
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
                        onValueChange={(value) => setTenantForm({ ...tenantForm, language: value })}
                        disabled={userData?.role !== 'admin'}
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

                  {userData?.role === 'admin' && (
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

            {/* Subscription Info */}
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
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
