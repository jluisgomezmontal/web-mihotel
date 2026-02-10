export interface TenantData {
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

export interface ProfileFormData {
  name: string
  email: string
  phone: string
  timezone: string
}

export interface SecurityFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

export interface TenantFormData {
  name: string
  type: 'hotel' | 'airbnb' | 'posada'
  currency: string
  timezone: string
  language: string
}
