import { useState, useEffect, useCallback } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import type { ProfileFormData, SecurityFormData, TenantFormData, TenantData } from '../types'

export function useSettingsForms(userData: any, refreshAll: () => void) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [tenant, setTenant] = useState<TenantData | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const [profileForm, setProfileForm] = useState<ProfileFormData>({
    name: "",
    email: "",
    phone: "",
    timezone: ""
  })

  const [securityForm, setSecurityForm] = useState<SecurityFormData>({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const [tenantForm, setTenantForm] = useState<TenantFormData>({
    name: "",
    type: "hotel",
    currency: "USD",
    timezone: "America/Mexico_City",
    language: "es"
  })

  // Load tenant data
  useEffect(() => {
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
  useEffect(() => {
    if (userData) {
      setProfileForm({
        name: userData.name || "",
        email: userData.email || "",
        phone: userData.profile?.phone || "",
        timezone: userData.profile?.timezone || "America/Mexico_City"
      })
    }
  }, [userData])

  const handleProfileUpdate = useCallback(async (e: React.FormEvent) => {
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
  }, [profileForm, refreshAll])

  const handlePasswordChange = useCallback(async (e: React.FormEvent) => {
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
  }, [securityForm])

  const handleTenantUpdate = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      const token = AuthService.getToken()
      if (!token) throw new Error('No authentication token')

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
  }, [tenantForm, refreshAll])

  return {
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
  }
}
