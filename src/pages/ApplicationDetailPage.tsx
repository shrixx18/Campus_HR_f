import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getApplicationTimeline, withdrawApplication } from '@/api/applications'
import { getOpportunity } from '@/api/opportunities'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, PageLoader } from '@/components/ui/loading'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage, resolveFileUrl } from '@/lib/utils'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { isStudent } = useAuth()
  const queryClient = useQueryClient()

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

  const withdrawMutation = useMutation({
    mutationFn: () => withdrawApplication(id!),
    onSuccess: () => {
      toast.success('Application withdrawn')
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      queryClient.invalidateQueries({ queryKey: ['application-timeline', id] })
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Withdraw failed')),
  })

  if (isLoading) return <PageLoader />
  if (error || !timeline) {
    return <EmptyState title="Application not found" />
  }

  const { application, stages } = timeline
  const resumeUrl = resolveFileUrl(application.resume_url)
  const canWithdraw = isStudent && application.status !== 'Withdrawn' && application.status !== 'Rejected'

  return (
    <div className="space-y-6">
      <Link
        to={isStudent ? '/applications' : '/coordinator/applications'}
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to applications
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{opportunity?.title ?? 'Application'}</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Applied {format(new Date(application.created_at), 'PPP')}
          </p>
        </div>
        <StatusBadge status={application.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {application.profile_snapshot && (
              <div>
                <p className="font-medium">Profile snapshot</p>
                <ul className="mt-1 space-y-1 text-[var(--color-muted-foreground)]">
                  {Object.entries(application.profile_snapshot).map(([key, value]) => (
                    <li key={key}>
                      {key}: {Array.isArray(value) ? value.join(', ') : String(value ?? '-')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[var(--color-primary)] hover:underline"
              >
                View resume <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {canWithdraw && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => withdrawMutation.mutate()}
                disabled={withdrawMutation.isPending}
              >
                {withdrawMutation.isPending ? 'Withdrawing...' : 'Withdraw application'}
              </Button>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            {stages.length === 0 ? (
              <p className="text-sm text-[var(--color-muted-foreground)]">No stages recorded yet.</p>
            ) : (
              <ol className="relative space-y-4 border-l border-[var(--color-border)] pl-4">
                {stages.map((stage) => (
                  <li key={stage.id} className="relative">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[var(--color-primary)]" />
                    <p className="font-medium">{stage.stage_name}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {format(new Date(stage.entered_at), 'PPP p')}
                      {stage.exited_at && ` — ${format(new Date(stage.exited_at), 'PPP p')}`}
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
