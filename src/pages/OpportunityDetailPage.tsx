import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format, isPast } from 'date-fns'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { createApplication, uploadResume } from '@/api/applications'
import { getOpportunity, registerForOpportunity, uploadOpportunityFile } from '@/api/opportunities'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DynamicFormFields } from '@/features/opportunities/DynamicFormFields'
import { EmptyState, PageLoader } from '@/components/ui/loading'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/utils'
import { ArrowLeft, Calendar, FileText } from 'lucide-react'

export function OpportunityDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isAuthenticated, isStudent } = useAuth()
  const queryClient = useQueryClient()
  const [fieldResponses, setFieldResponses] = useState<Record<string, unknown>>({})
  const [resumeFile, setResumeFile] = useState<File | null>(null)

  const { data: opportunity, isLoading, error } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => getOpportunity(id!),
    enabled: Boolean(id),
  })

  const registerMutation = useMutation({
    mutationFn: async () => {
      let resumeUrl: string | undefined
      if (resumeFile) {
        resumeUrl = await uploadOpportunityFile(resumeFile)
      }
      return registerForOpportunity(id!, { field_responses: fieldResponses, resume_url: resumeUrl })
    },
    onSuccess: () => {
      toast.success('Registration submitted!')
      queryClient.invalidateQueries({ queryKey: ['opportunity', id] })
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Registration failed')),
  })

  const applyMutation = useMutation({
    mutationFn: async () => {
      let resumeUrl: string | undefined
      if (resumeFile) {
        resumeUrl = await uploadResume(resumeFile)
      }
      return createApplication({ opportunity_id: id!, resume_url: resumeUrl })
    },
    onSuccess: () => {
      toast.success('Application submitted!')
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Application failed')),
  })

  if (isLoading) return <PageLoader />
  if (error || !opportunity) {
    return <EmptyState title="Opportunity not found" description="This opportunity may have been removed." />
  }

  const deadlinePassed = opportunity.deadline ? isPast(new Date(opportunity.deadline)) : false
  const sortedFields = [...opportunity.form_fields].sort((a, b) => a.sort_order - b.sort_order)
  const hasFormFields = sortedFields.length > 0

  return (
    <div className="space-y-6">
      <Link to="/opportunities" className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to opportunities
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{opportunity.title}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <StatusBadge status={opportunity.status} />
            {opportunity.deadline && (
              <span className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
                <Calendar className="h-4 w-4" />
                Deadline: {format(new Date(opportunity.deadline), 'PPP p')}
                {deadlinePassed && <span className="text-red-600">(Passed)</span>}
              </span>
            )}
          </div>
        </div>
      </div>

      {opportunity.description && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{opportunity.description}</p>
          </CardContent>
        </Card>
      )}

      {isAuthenticated && isStudent && !deadlinePassed && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-5 w-5" />
              Apply for this opportunity
            </CardTitle>
            <CardDescription>
              {hasFormFields
                ? 'Step 1: Complete the registration form. Step 2: Submit your application with resume.'
                : 'Upload your resume and submit your application.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {hasFormFields && (
              <div className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
                <h3 className="font-medium">Registration form</h3>
                <DynamicFormFields
                  fields={sortedFields}
                  values={fieldResponses}
                  onChange={setFieldResponses}
                />
                <Button
                  onClick={() => registerMutation.mutate()}
                  disabled={registerMutation.isPending}
                  variant="secondary"
                >
                  {registerMutation.isPending ? 'Registering...' : 'Submit registration'}
                </Button>
              </div>
            )}

            <div className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
              <h3 className="font-medium">Application</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="resume">
                  Resume (PDF, DOC, DOCX)
                </label>
                <input
                  id="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
                  className="block w-full text-sm"
                />
              </div>
              <Button onClick={() => applyMutation.mutate()} disabled={applyMutation.isPending}>
                {applyMutation.isPending ? 'Submitting...' : 'Submit application'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!isAuthenticated && (
        <Card>
          <CardContent className="flex items-center justify-between py-6">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Sign in as a student to register and apply.
            </p>
            <Link to="/login">
              <Button>Sign in</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
