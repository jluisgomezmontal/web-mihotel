import { useState, useCallback, useEffect, useMemo } from 'react'
import { AuthService } from '@/lib/auth'
import { API_BASE_URL } from '@/lib/api-config'
import type { DashboardMetrics } from '../types'

export function useDashboardMetrics(properties: any[], reservations: any[], rooms: any[]) {
  const [dashboardMetrics, setDashboardMetrics] = useState<any>(null)
  const [metricsLoading, setMetricsLoading] = useState(true)

  const fetchDashboardMetrics = useCallback(async () => {
    try {
      const token = AuthService.getToken()
      if (!token) return

      const response = await fetch(`${API_BASE_URL}/reports/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const data = await response.json()
        setDashboardMetrics(data.data)
      }
    } catch (err) {
      console.error('Error fetching dashboard metrics:', err)
    } finally {
      setMetricsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboardMetrics()
  }, [fetchDashboardMetrics])

  const kpis = useMemo<DashboardMetrics>(() => {
    const roomsArray = Array.isArray(rooms) ? rooms : []
    const reservationsArray = Array.isArray(reservations) ? reservations : []

    if (dashboardMetrics) {
      const cleaningRooms = roomsArray.filter(r => r.status === 'cleaning').length
      const maintenanceRooms = roomsArray.filter(r => r.status === 'maintenance').length
      
      const today = new Date().toISOString().split('T')[0]
      const todayRevenue = reservationsArray
        .filter(r => {
          if (!r.dates?.checkInDate) return false
          const checkInDate = new Date(r.dates.checkInDate).toISOString().split('T')[0]
          return checkInDate === today
        })
        .reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0)

      const averageRate = reservationsArray.length > 0
        ? Math.round(reservationsArray.reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0) / reservationsArray.length)
        : 0

      return {
        occupancyRate: dashboardMetrics.occupancyRate || 0,
        totalRooms: dashboardMetrics.totalRooms || 0,
        availableRooms: dashboardMetrics.availableRooms || 0,
        occupiedRooms: dashboardMetrics.occupiedRooms || 0,
        cleaningRooms,
        maintenanceRooms,
        todayCheckIns: dashboardMetrics.todayCheckIns || 0,
        todayCheckOuts: dashboardMetrics.todayCheckOuts || 0,
        totalRevenue: todayRevenue,
        monthlyRevenue: dashboardMetrics.monthlyRevenue || 0,
        averageRate,
        pendingReservations: dashboardMetrics.pendingReservations || 0,
        activeGuests: dashboardMetrics.activeGuests || 0
      }
    }

    const propertiesArray = Array.isArray(properties) ? properties : []
    const totalRooms = propertiesArray.reduce((sum, prop) => sum + (prop.totalRooms || 0), 0)
    const availableRooms = propertiesArray.reduce((sum, prop) => sum + (prop.availableRooms || 0), 0)
    const occupiedRooms = propertiesArray.reduce((sum, prop) => sum + (prop.occupiedRooms || 0), 0)
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
    
    const today = new Date().toISOString().split('T')[0]
    const todayCheckIns = reservationsArray.filter(r => {
      if (!r.dates?.checkInDate) return false
      const checkInDate = new Date(r.dates.checkInDate).toISOString().split('T')[0]
      return checkInDate === today
    }).length
    
    const todayCheckOuts = reservationsArray.filter(r => {
      if (!r.dates?.checkOutDate) return false
      const checkOutDate = new Date(r.dates.checkOutDate).toISOString().split('T')[0]
      return checkOutDate === today
    }).length

    const monthlyRevenue = reservationsArray
      .filter(r => {
        if (!r.dates?.checkInDate) return false
        const checkIn = new Date(r.dates.checkInDate)
        const now = new Date()
        return checkIn.getMonth() === now.getMonth() && 
               checkIn.getFullYear() === now.getFullYear()
      })
      .reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0)

    const todayRevenue = reservationsArray
      .filter(r => {
        if (!r.dates?.checkInDate) return false
        const checkInDate = new Date(r.dates.checkInDate).toISOString().split('T')[0]
        return checkInDate === today
      })
      .reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0)

    const averageRate = reservationsArray.length > 0
      ? Math.round(reservationsArray.reduce((sum, r) => sum + (r.pricing?.totalPrice || 0), 0) / reservationsArray.length)
      : 0

    const cleaningRooms = roomsArray.filter(r => r.status === 'cleaning').length
    const maintenanceRooms = roomsArray.filter(r => r.status === 'maintenance').length
    const pendingReservations = reservationsArray.filter(r => r.status === 'pending').length
    const activeGuests = reservationsArray.filter(r => r.status === 'checked_in').length
    
    return {
      occupancyRate,
      totalRooms,
      availableRooms,
      occupiedRooms,
      cleaningRooms,
      maintenanceRooms,
      todayCheckIns,
      todayCheckOuts,
      totalRevenue: todayRevenue,
      monthlyRevenue,
      averageRate,
      pendingReservations,
      activeGuests
    }
  }, [properties, reservations, rooms, dashboardMetrics])

  return {
    kpis,
    metricsLoading,
    fetchDashboardMetrics
  }
}
