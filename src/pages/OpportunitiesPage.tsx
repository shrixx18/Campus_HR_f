import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { listOpportunities } from '@/api/opportunities'
import { StatusBadge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, Skeleton } from '@/components/ui/loading'
import { Calendar, ChevronRight } from 'lucide-react'

export function OpportunitiesPage() {
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ['opportunities'],
    queryFn: listOpportunities,
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }

  if (error) {
    return <EmptyState title="Failed to load opportunities" description="Please check that the backend is running." />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Opportunities</h1>
        <p className="mt-1 text-[var(--color-muted-foreground)]">
          Browse campus placement and internship openings
        </p>
      </div>

      {!opportunities?.length ? (
        <EmptyState title="No opportunities yet" description="Check back later for new openings." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {opportunities.map((opp) => (
            <Link key={opp.id} to={`/opportunities/${opp.id}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2">{opp.title}</CardTitle>
                    <StatusBadge status={opp.status} />
                  </div>
                  {opp.description && (
                    <CardDescription className="line-clamp-2">{opp.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-[var(--color-muted-foreground)]">
                    {opp.deadline ? (
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Deadline: {format(new Date(opp.deadline), 'MMM d, yyyy')}
                      </span>
                    ) : (
                      <span>No deadline</span>
                    )}
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
