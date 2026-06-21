import { useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'

export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const accessToken = useAuthStore((s) => s.accessToken)
  const user = useAuthStore((s) => s.user)
  const isHydrated = useAuthStore((s) => s.isHydrated)
  const fetchMe = useAuthStore((s) => s.fetchMe)

  useEffect(() => {
    if (isHydrated && accessToken && !user) {
      fetchMe().catch(() => {
        useAuthStore.getState().logout()
      })
    }
  }, [isHydrated, accessToken, user, fetchMe])

  return children
}
