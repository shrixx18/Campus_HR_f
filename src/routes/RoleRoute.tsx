import { Navigate, Outlet } from 'react-router-dom'
import { PageLoader } from '@/components/ui/loading'
import { useAuth } from '@/hooks/useAuth'
import type { UserRole } from '@/types'

interface RoleRouteProps {
  role: UserRole
}

export function RoleRoute({ role }: RoleRouteProps) {
  const { user, isHydrated } = useAuth()

  if (!isHydrated) return <PageLoader />
  if (!user || user.role !== role) return <Navigate to="/opportunities" replace />

  return <Outlet />
}
