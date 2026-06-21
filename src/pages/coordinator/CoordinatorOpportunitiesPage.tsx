import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'
import { listOpportunities } from '@/api/opportunities'
import { StatusBadge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, Skeleton } from '@/components/ui/loading'
import { useAuth } from '@/hooks/useAuth'
import { Calendar, Plus, Users } from 'lucide-react'

export function CoordinatorOpportunitiesPage() {
  const { user } = useAuth()

  const { data: opportunities, isLoading } = useQuery({
    queryKey: ['opportunities'],
    queryFn: listOpportunities,
  })

  const myOpportunities = opportunities?.filter((o) => o.coordinator_id === user?.id) ?? []

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-32" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Manage Opportunities</h1>
          <p className="mt-1 text-[var(--color-muted-foreground)]">
            Create and manage your placement opportunities
          </p>
        </div>
        <Link to="/coordinator/opportunities/new">
          <Button>
            <Plus className="h-4 w-4" />
            New opportunity
          </Button>
        </Link>
      </div>

      {!myOpportunities.length ? (
        <EmptyState
          title="No opportunities yet"
          description="Create your first opportunity to start receiving registrations."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {myOpportunities.map((opp) => (
            <Card key={opp.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="line-clamp-2">{opp.title}</CardTitle>
                  <StatusBadge status={opp.status} />
                </div>
                {opp.description && <CardDescription className="line-clamp-2">{opp.description}</CardDescription>}
              </CardHeader>
              <CardContent className="space-y-4">
                {opp.deadline && (
                  <p className="flex items-center gap-1 text-sm text-[var(--color-muted-foreground)]">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(opp.deadline), 'PPP')}
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  <Link to={`/coordinator/opportunities/${opp.id}/edit`}>
                    <Button variant="outline" size="sm">Edit</Button>
                  </Link>
                  <Link to={`/coordinator/opportunities/${opp.id}/registrations`}>
                    <Button variant="secondary" size="sm">
                      <Users className="h-4 w-4" />
                      Registrations
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
