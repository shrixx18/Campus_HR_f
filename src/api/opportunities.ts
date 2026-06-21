import { apiClient } from '@/api/client'
import type {
  Opportunity,
  OpportunityCreate,
  OpportunityUpdate,
  Registration,
  RegistrationCreate,
} from '@/types'

export async function listOpportunities(): Promise<Opportunity[]> {
  const { data } = await apiClient.get<Opportunity[]>('/api/v1/opportunities')
  return data
}

export async function getOpportunity(id: string): Promise<Opportunity> {
  const { data } = await apiClient.get<Opportunity>(`/api/v1/opportunities/${id}`)
  return data
}

export async function createOpportunity(payload: OpportunityCreate): Promise<Opportunity> {
  const { data } = await apiClient.post<Opportunity>('/api/v1/opportunities', payload)
  return data
}

export async function updateOpportunity(id: string, payload: OpportunityUpdate): Promise<Opportunity> {
  const { data } = await apiClient.patch<Opportunity>(`/api/v1/opportunities/${id}`, payload)
  return data
}

export async function registerForOpportunity(
  opportunityId: string,
  payload: RegistrationCreate,
): Promise<Registration> {
  const { data } = await apiClient.post<Registration>(
    `/api/v1/opportunities/${opportunityId}/registrations`,
    payload,
  )
  return data
}

export async function listRegistrations(opportunityId: string): Promise<Registration[]> {
  const { data } = await apiClient.get<Registration[]>(
    `/api/v1/opportunities/${opportunityId}/registrations`,
  )
  return data
}

export async function uploadOpportunityFile(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<{ url: string }>(
    '/api/v1/opportunities/files/upload',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.url
}

export async function exportRegistrations(opportunityId: string): Promise<Blob> {
  const { data } = await apiClient.get<Blob>(`/api/v1/opportunities/${opportunityId}/export`, {
    responseType: 'blob',
  })
  return data
}
