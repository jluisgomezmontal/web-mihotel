import { User } from '@/types'

/**
 * Permission types available in the system
 */
export type Permission = 
  | 'canManageProperties'
  | 'canManageUsers'
  | 'canManageReservations'
  | 'canViewReports'

/**
 * Route permissions mapping
 * Maps routes to required permissions
 */
export const ROUTE_PERMISSIONS: Record<string, Permission | Permission[] | null> = {
  '/dashboard': null, // Accessible to all authenticated users
  '/properties': 'canManageProperties',
  '/rooms': 'canManageProperties',
  '/reservations': 'canManageReservations',
  '/guests': 'canManageReservations',
  '/payments': 'canManageReservations',
  '/users': 'canManageUsers',
  '/reports': 'canViewReports',
  '/settings': null, // Accessible to all authenticated users
}

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User | null, permission: Permission): boolean {
  if (!user) return false
  
  // Admins have all permissions
  if (user.role === 'admin') return true
  
  return user.permissions[permission] === true
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  
  // Admins have all permissions
  if (user.role === 'admin') return true
  
  return permissions.some(permission => user.permissions[permission] === true)
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(user: User | null, permissions: Permission[]): boolean {
  if (!user) return false
  
  // Admins have all permissions
  if (user.role === 'admin') return true
  
  return permissions.every(permission => user.permissions[permission] === true)
}

/**
 * Check if user can access a specific route
 */
export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false
  
  // Admins can access everything
  if (user.role === 'admin') return true
  
  // Find the route permission configuration
  const routePermission = ROUTE_PERMISSIONS[route]
  
  // If route has no permission requirement, allow access
  if (routePermission === null || routePermission === undefined) {
    return true
  }
  
  // If route requires a single permission
  if (typeof routePermission === 'string') {
    return hasPermission(user, routePermission)
  }
  
  // If route requires multiple permissions (any of them)
  if (Array.isArray(routePermission)) {
    return hasAnyPermission(user, routePermission)
  }
  
  return false
}

/**
 * Get user's accessible routes from a list of routes
 */
export function getAccessibleRoutes(user: User | null, routes: string[]): string[] {
  if (!user) return []
  
  return routes.filter(route => canAccessRoute(user, route))
}

/**
 * Check if user is admin
 */
export function isAdmin(user: User | null): boolean {
  return user?.role === 'admin'
}

/**
 * Check if user is staff
 */
export function isStaff(user: User | null): boolean {
  return user?.role === 'staff'
}

/**
 * Check if user is cleaning staff
 */
export function isCleaning(user: User | null): boolean {
  return user?.role === 'cleaning'
}

/**
 * Get permission label for display
 */
export function getPermissionLabel(permission: Permission): string {
  const labels: Record<Permission, string> = {
    canManageProperties: 'Gestionar Propiedades',
    canManageUsers: 'Gestionar Usuarios',
    canManageReservations: 'Gestionar Reservas',
    canViewReports: 'Ver Reportes',
  }
  
  return labels[permission] || permission
}

/**
 * Get all permissions for a user
 */
export function getUserPermissions(user: User | null): Permission[] {
  if (!user) return []
  
  const permissions: Permission[] = []
  
  if (user.permissions.canManageProperties) permissions.push('canManageProperties')
  if (user.permissions.canManageUsers) permissions.push('canManageUsers')
  if (user.permissions.canManageReservations) permissions.push('canManageReservations')
  if (user.permissions.canViewReports) permissions.push('canViewReports')
  
  return permissions
}
