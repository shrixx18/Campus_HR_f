export type UserRole = 'student' | 'coordinator'

export type ApplicationStatus =
  | 'Applied'
  | 'Shortlisted'
  | 'Assessment'
  | 'Technical Interview'
  | 'HR Interview'
  | 'Selected'
  | 'Rejected'
  | 'Withdrawn'

export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'dropdown'
  | 'checkbox'
  | 'file'
  | 'deadline'

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface User {
  id: string
  email: string
  role: UserRole
  is_active: boolean
}

export interface Profile {
  user_id: string
  name: string | null
  cgpa: number | null
  branch: string | null
  year: number | null
  phone: string | null
  skills: string[] | null
  updated_at: string | null
}

export interface FormField {
  id: string
  field_type: FormFieldType
  label: string
  required: boolean
  options: Record<string, unknown> | null
  maps_to_profile_field: string | null
  sort_order: number
}

export interface Opportunity {
  id: string
  title: string
  description: string | null
  coordinator_id: string
  deadline: string | null
  status: string
  form_fields: FormField[]
}

export interface OpportunityCreate {
  title: string
  description?: string | null
  deadline?: string | null
  form_fields?: FormFieldCreate[]
  eligibility_rules?: Record<string, unknown>[]
}

export interface FormFieldCreate {
  field_type: FormFieldType
  label: string
  required?: boolean
  options?: Record<string, unknown> | null
  maps_to_profile_field?: string | null
  sort_order?: number
}

export interface OpportunityUpdate {
  title?: string | null
  description?: string | null
  deadline?: string | null
  status?: string | null
}

export interface Registration {
  id: string
  opportunity_id: string
  student_id: string
  field_responses: Record<string, unknown>
  resume_url: string | null
  submitted_at: string
}

export interface RegistrationCreate {
  field_responses?: Record<string, unknown>
  resume_url?: string | null
}

export interface Application {
  id: string
  opportunity_id: string
  student_id: string
  status: string
  resume_url: string | null
  profile_snapshot: Record<string, unknown> | null
  overrides: Record<string, unknown> | null
  created_at: string
}

export interface ApplicationCreate {
  opportunity_id: string
  overrides?: Record<string, unknown>
  resume_url?: string | null
}

export interface WorkflowStage {
  id: string
  stage_name: string
  entered_at: string
  exited_at: string | null
  actor_id: string | null
}

export interface Timeline {
  application: Application
  stages: WorkflowStage[]
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Shortlisted',
  'Assessment',
  'Technical Interview',
  'HR Interview',
  'Selected',
  'Rejected',
]

export const FORM_FIELD_TYPES: FormFieldType[] = [
  'text',
  'number',
  'email',
  'dropdown',
  'checkbox',
  'file',
  'deadline',
]
