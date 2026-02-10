import { useState, useCallback, useEffect } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import type { ReportData } from '../types'

export function useReportData(dateRange: string, period: string) {
  const [reportData, setReportData] = useState<ReportData>({})
  const [isLoading, setIsLoading] = useState(true)

  const loadReports = useCallback(async () => {
    try {
      setIsLoading(true)
      const token = AuthService.getToken()
      
      if (!token) {
        window.location.href = '/auth/login'
        return
      }

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - parseInt(dateRange))
      const endDate = new Date()

      const params = new URLSearchParams({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        period
      })

      const [revenueRes, occupancyRes, guestsRes, reservationsRes, dashboardRes] = await Promise.all([
        fetch(`${API_BASE_URL}/reports/revenue?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reports/occupancy?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reports/guests?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reports/reservations?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API_BASE_URL}/reports/dashboard`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      const [revenue, occupancy, guests, reservations, dashboard] = await Promise.all([
        revenueRes.ok ? revenueRes.json() : null,
        occupancyRes.ok ? occupancyRes.json() : null,
        guestsRes.ok ? guestsRes.json() : null,
        reservationsRes.ok ? reservationsRes.json() : null,
        dashboardRes.ok ? dashboardRes.json() : null
      ])

      setReportData({
        revenue: revenue?.data,
        occupancy: occupancy?.data,
        guests: guests?.data,
        reservations: reservations?.data,
        dashboard: dashboard?.data
      })

    } catch (error) {
      console.error('Error loading reports:', error)
    } finally {
      setIsLoading(false)
    }
  }, [dateRange, period])

  useEffect(() => {
    loadReports()
  }, [loadReports])

  return {
    reportData,
    isLoading,
    loadReports
  }
}
