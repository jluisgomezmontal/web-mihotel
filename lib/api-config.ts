export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    logout: `${API_BASE_URL}/auth/logout`,
    profile: `${API_BASE_URL}/auth/profile`,
  },
  users: `${API_BASE_URL}/users`,
  properties: `${API_BASE_URL}/properties`,
  rooms: `${API_BASE_URL}/rooms`,
  guests: `${API_BASE_URL}/guests`,
  reservations: `${API_BASE_URL}/reservations`,
  payments: `${API_BASE_URL}/payments`,
  reports: `${API_BASE_URL}/reports`,
}
