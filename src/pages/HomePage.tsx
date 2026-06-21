import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function HomePage() {
  const { isAuthenticated, isStudent, isCoordinator } = useAuth()

  if (!isAuthenticated) return <Navigate to="/opportunities" replace />
  if (isCoordinator) return <Navigate to="/coordinator/opportunities" replace />
  if (isStudent) return <Navigate to="/applications" replace />
  return <Navigate to="/opportunities" replace />
}
