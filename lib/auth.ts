import { User, Tenant } from '@/types'

const API_BASE_URL = 'http://localhost:3000/api'

/**
 * Authentication utilities for MiHotel SaaS
 */
export class AuthService {
  private static readonly TOKEN_KEY = 'auth_token'
  private static readonly USER_KEY = 'user_data'
  private static readonly TENANT_KEY = 'tenant_data'

  /**
   * Store authentication data in localStorage
   */
  static setAuth(token: string, user: User, tenant: Tenant): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(user))
      localStorage.setItem(this.TENANT_KEY, JSON.stringify(tenant))
    }
  }

  /**
   * Get stored authentication token
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY)
    }
    return null
  }

  /**
   * Get stored user data
   */
  static getUser(): User | null {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem(this.USER_KEY)
      return userData ? JSON.parse(userData) : null
    }
    return null
  }

  /**
   * Get stored tenant data
   */
  static getTenant(): Tenant | null {
    if (typeof window !== 'undefined') {
      const tenantData = localStorage.getItem(this.TENANT_KEY)
      return tenantData ? JSON.parse(tenantData) : null
    }
    return null
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  /**
   * Clear authentication data (logout)
   */
  static clearAuth(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY)
      localStorage.removeItem(this.USER_KEY)
      localStorage.removeItem(this.TENANT_KEY)
    }
  }

  /**
   * Login user with credentials
   */
  static async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      const { token, user, tenant } = result.data
      this.setAuth(token, user, tenant)
      return { success: true, data: { token, user, tenant } }
    }

    return { 
      success: false, 
      message: result.message || 'Login failed',
      errors: result.errors || []
    }
  }

  /**
   * Register new tenant and admin user
   */
  static async register(registerData: {
    tenant: {
      name: string
      type: string
      plan?: string
      settings?: any
    }
    admin: {
      name: string
      email: string
      password: string
      profile?: any
    }
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    })

    const result = await response.json()

    if (response.ok && result.success) {
      const { token, user, tenant } = result.data
      this.setAuth(token, user, tenant)
      return { success: true, data: { token, user, tenant } }
    }

    return { 
      success: false, 
      message: result.message || 'Registration failed',
      errors: result.errors || []
    }
  }

  /**
   * Logout user
   */
  static async logout() {
    const token = this.getToken()
    
    if (token) {
      try {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        console.error('Logout API call failed:', error)
      }
    }

    this.clearAuth()
  }

  /**
   * Get user profile
   */
  static async getProfile() {
    const token = this.getToken()
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    const result = await response.json()

    if (response.ok && result.success) {
      return { success: true, data: result.data }
    }

    throw new Error(result.message || 'Failed to fetch profile')
  }

  /**
   * Make authenticated API request
   */
  static async makeAuthenticatedRequest(
    endpoint: string, 
    options: RequestInit = {}
  ) {
    const token = this.getToken()
    
    if (!token) {
      throw new Error('No authentication token found')
    }

    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (response.status === 401) {
      // Token expired or invalid - clear auth and redirect to login
      this.clearAuth()
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
      throw new Error('Authentication expired')
    }

    return response
  }
}
