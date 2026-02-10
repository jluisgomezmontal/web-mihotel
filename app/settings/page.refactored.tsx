"use client"

import * as React from "react"
import { User, Lock, Building2, Sparkles, CheckCircle, AlertCircle } from "lucide-react"
import { MainLayout } from "@/components/layout/main-layout"
import { DashboardSkeleton } from "@/components/ui/skeleton-loader"
import { useDashboard } from "@/contexts/DashboardContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { ProfileTab } from "./components/ProfileTab"
import { SecurityTab } from "./components/SecurityTab"
import { TenantTab } from "./components/TenantTab"
import { useSettingsForms } from "./hooks/useSettingsForms"

export default function SettingsPage() {
  const { userData, tenantData, refreshAll } = useDashboard()
  const [activeTab, setActiveTab] = React.useState("profile")
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false)
  const [showNewPassword, setShowNewPassword] = React.useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

  const {
    isLoading,
    isSaving,
    tenant,
    successMessage,
    errorMessage,
    profileForm,
    setProfileForm,
    securityForm,
    setSecurityForm,
    tenantForm,
    setTenantForm,
    handleProfileUpdate,
    handlePasswordChange,
    handleTenantUpdate
  } = useSettingsForms(userData, refreshAll)

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

          <TabsContent value="profile">
            <ProfileTab
              profileForm={profileForm}
              onProfileFormChange={setProfileForm}
              onSubmit={handleProfileUpdate}
              isSaving={isSaving}
              userData={userData}
            />
          </TabsContent>

          <TabsContent value="security">
            <SecurityTab
              securityForm={securityForm}
              onSecurityFormChange={setSecurityForm}
              onSubmit={handlePasswordChange}
              isSaving={isSaving}
              showCurrentPassword={showCurrentPassword}
              showNewPassword={showNewPassword}
              showConfirmPassword={showConfirmPassword}
              onToggleCurrentPassword={() => setShowCurrentPassword(!showCurrentPassword)}
              onToggleNewPassword={() => setShowNewPassword(!showNewPassword)}
              onToggleConfirmPassword={() => setShowConfirmPassword(!showConfirmPassword)}
            />
          </TabsContent>

          <TabsContent value="tenant">
            <TenantTab
              tenantForm={tenantForm}
              onTenantFormChange={setTenantForm}
              onSubmit={handleTenantUpdate}
              isSaving={isSaving}
              userData={userData}
              tenant={tenant}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
