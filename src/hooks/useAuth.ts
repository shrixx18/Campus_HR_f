import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const accessToken = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const login = useAuthStore((s) => s.login)
  const register = useAuthStore((s) => s.register)
  const logout = useAuthStore((s) => s.logout)
  const fetchMe = useAuthStore((s) => s.fetchMe)

  return {
    accessToken,
    user,
    isAuthenticated: Boolean(accessToken && user),
    isHydrated,
    isStudent: user?.role === 'student',
    isCoordinator: user?.role === 'coordinator',
    login,
    register,
    logout,
    fetchMe,
  }
}
