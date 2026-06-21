import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import * as authApi from '@/api/auth'
import type { User, UserRole } from '@/types'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isHydrated: boolean
  setTokens: (accessToken: string, refreshToken: string) => void
  setUser: (user: User | null) => void
  setHydrated: (value: boolean) => void
  login: (email: string, password: string) => Promise<User>
  register: (email: string, password: string, role: UserRole) => Promise<User>
  logout: () => Promise<void>
  fetchMe: () => Promise<User>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: false,

      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setUser: (user) => set({ user }),
      setHydrated: (value) => set({ isHydrated: value }),

      login: async (email, password) => {
        const tokens = await authApi.login({ email, password })
        set({ accessToken: tokens.access_token, refreshToken: tokens.refresh_token })
        const user = await authApi.getMe()
        set({ user })
        return user
      },

      register: async (email, password, role) => {
        await authApi.register({ email, password, role })
        return get().login(email, password)
      },

      logout: async () => {
        const { accessToken } = get()
        if (accessToken) {
          try {
            await authApi.logout()
          } catch {
            // ignore logout errors
          }
        }
        set({ accessToken: null, refreshToken: null, user: null })
      },

      fetchMe: async () => {
        const user = await authApi.getMe()
        set({ user })
        return user
      },
    }),
    {
      name: 'campushire-auth',
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true)
      },
    },
  ),
)
