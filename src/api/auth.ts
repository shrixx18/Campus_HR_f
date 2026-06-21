import { apiClient } from '@/api/client'
import type { Profile, TokenResponse, User, UserRole } from '@/types'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  role: UserRole
}

export interface ProfileUpdatePayload {
  name?: string | null
  cgpa?: number | null
  branch?: string | null
  year?: number | null
  phone?: string | null
  skills?: string[] | null
}

export async function login(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<TokenResponse>('/api/v1/auth/login', payload)
  return data
}

export async function register(payload: RegisterPayload): Promise<User> {
  const { data } = await apiClient.post<User>('/api/v1/auth/register', payload)
  return data
}

export async function logout(): Promise<void> {
  await apiClient.post('/api/v1/auth/logout')
}

export async function getMe(): Promise<User> {
  const { data } = await apiClient.get<User>('/api/v1/auth/me')
  return data
}

export async function getProfile(userId: string): Promise<Profile> {
  const { data } = await apiClient.get<Profile>(`/api/v1/auth/profile/${userId}`)
  return data
}

export async function updateProfile(payload: ProfileUpdatePayload): Promise<Profile> {
  const { data } = await apiClient.put<Profile>('/api/v1/auth/profile', payload)
  return data
}
