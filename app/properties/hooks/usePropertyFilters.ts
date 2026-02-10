import { useMemo } from 'react'
import type { Property, PropertyStats } from '../types'

export function usePropertyFilters(properties: Property[], searchTerm: string) {
  const filteredProperties = useMemo(() => {
    const propertiesArray = Array.isArray(properties) ? properties : []
    
    return propertiesArray.filter((property: Property) =>
      property.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address?.city?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [properties, searchTerm])

  const stats = useMemo<PropertyStats>(() => {
    const propertiesArray = Array.isArray(properties) ? properties : []
    
    return {
      total: propertiesArray.length,
      totalRooms: propertiesArray.reduce((sum, p) => sum + (p.totalRooms || 0), 0),
      occupiedRooms: propertiesArray.reduce((sum, p) => sum + (p.occupiedRooms || 0), 0),
      totalRevenue: propertiesArray.reduce((sum, p) => sum + (p.monthlyRevenue || 0), 0)
    }
  }, [properties])

  return {
    filteredProperties,
    stats
  }
}
