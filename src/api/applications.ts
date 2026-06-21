import { apiClient } from '@/api/client'
import type { Application, ApplicationCreate, ApplicationStatus, Timeline } from '@/types'

export async function listApplications(): Promise<Application[]> {
  const { data } = await apiClient.get<Application[]>('/api/v1/applications')
  return data
}

export async function getApplication(id: string): Promise<Application> {
  const { data } = await apiClient.get<Application>(`/api/v1/applications/${id}`)
  return data
}

export async function createApplication(payload: ApplicationCreate): Promise<Application> {
  const { data } = await apiClient.post<Application>('/api/v1/applications', payload)
  return data
}

export async function withdrawApplication(id: string): Promise<Application> {
  const { data } = await apiClient.post<Application>(`/api/v1/applications/${id}/withdraw`)
  return data
}

export async function updateApplicationStatus(
  id: string,
  status: ApplicationStatus,
): Promise<Application> {
  const { data } = await apiClient.patch<Application>(`/api/v1/applications/${id}/status`, {
    status,
  })
  return data
}

export async function getApplicationTimeline(id: string): Promise<Timeline> {
  const { data } = await apiClient.get<Timeline>(`/api/v1/applications/${id}/timeline`)
  return data
}

export async function uploadResume(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const { data } = await apiClient.post<{ url: string }>(
    '/api/v1/applications/files/resume',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  )
  return data.url
}
