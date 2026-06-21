import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { listApplications } from '@/api/applications'
import { listOpportunities } from '@/api/opportunities'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, Skeleton } from '@/components/ui/loading'
import { ChevronRight } from 'lucide-react'

export function CoordinatorApplicationsPage() {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: listApplications,
  })

  const { data: opportunities } = useQuery({
    queryKey: ['opportunities'],
    queryFn: listOpportunities,
  })

  const oppMap = new Map(opportunities?.map((o) => [o.id, o.title]) ?? [])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-24" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Applications</h1>
        <p className="mt-1 text-[var(--color-muted-foreground)]">
          Review and update application statuses
        </p>
      </div>

      {!applications?.length ? (
        <EmptyState title="No applications yet" />
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <Link key={app.id} to={`/coordinator/applications/${app.id}`}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div>
                    <CardTitle className="text-base">
                      {oppMap.get(app.opportunity_id) ?? 'Opportunity'}
                    </CardTitle>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      Student: {app.student_id.slice(0, 8)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={app.status} />
                    <ChevronRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--color-muted-foreground)]">
                    Applied {format(new Date(app.created_at), 'PPP')}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
