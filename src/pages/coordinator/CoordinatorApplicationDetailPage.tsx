import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getApplicationTimeline, updateApplicationStatus } from '@/api/applications'
import { getOpportunity } from '@/api/opportunities'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select } from '@/components/ui/select'
import { EmptyState, PageLoader } from '@/components/ui/loading'
import { getErrorMessage, resolveFileUrl } from '@/lib/utils'
import { APPLICATION_STATUSES, type ApplicationStatus } from '@/types'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export function CoordinatorApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const queryClient = useQueryClient()
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Applied')

  const { data: timeline, isLoading, error } = useQuery({
    queryKey: ['application-timeline', id],
    queryFn: () => getApplicationTimeline(id!),
    enabled: Boolean(id),
  })

  const { data: opportunity } = useQuery({
    queryKey: ['opportunity', timeline?.application.opportunity_id],
    queryFn: () => getOpportunity(timeline!.application.opportunity_id),
    enabled: Boolean(timeline?.application.opportunity_id),
  })

  const statusMutation = useMutation({
    mutationFn: (status: ApplicationStatus) => updateApplicationStatus(id!, status),
    onSuccess: () => {
      toast.success('Status updated')
      queryClient.invalidateQueries({ queryKey: ['application-timeline', id] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Status update failed')),
  })

  if (isLoading) return <PageLoader />
  if (error || !timeline) return <EmptyState title="Application not found" />

  const { application, stages } = timeline
  const resumeUrl = resolveFileUrl(application.resume_url)

  return (
    <div className="space-y-6">
      <Link
        to="/coordinator/applications"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{opportunity?.title ?? 'Application'}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Student {application.student_id.slice(0, 8)}... · Applied {format(new Date(application.created_at), 'PPP')}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Update status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
            >
              {APPLICATION_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </Select>
            <Button
              onClick={() => statusMutation.mutate(newStatus)}
              disabled={statusMutation.isPending}
            >
              {statusMutation.isPending ? 'Updating...' : 'Update status'}
            </Button>
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
              >
                View resume <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="relative space-y-4 border-l border-[var(--color-border)] pl-4">
              {stages.map((stage) => (
                <li key={stage.id} className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                  <p className="font-medium">{stage.stage_name}</p>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {format(new Date(stage.entered_at), 'PPP p')}
                  </p>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
