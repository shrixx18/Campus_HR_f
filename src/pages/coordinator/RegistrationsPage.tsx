import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { exportRegistrations, getOpportunity, listRegistrations } from '@/api/opportunities'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState, PageLoader } from '@/components/ui/loading'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { resolveFileUrl } from '@/lib/utils'
import { ArrowLeft, Download } from 'lucide-react'

export function RegistrationsPage() {
  const { id } = useParams<{ id: string }>()

  const { data: opportunity, isLoading: oppLoading } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => getOpportunity(id!),
    enabled: Boolean(id),
  })

  const { data: registrations, isLoading: regLoading } = useQuery({
    queryKey: ['registrations', id],
    queryFn: () => listRegistrations(id!),
    enabled: Boolean(id),
  })

  const handleExport = async () => {
    try {
      const blob = await exportRegistrations(id!)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `registrations_${id}.xlsx`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Export downloaded')
    } catch {
      toast.error('Export failed')
    }
  }

  if (oppLoading || regLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <Link
        to="/coordinator/opportunities"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to opportunities
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Registrations</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">{opportunity?.title}</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{registrations?.length ?? 0} registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {!registrations?.length ? (
            <EmptyState title="No registrations yet" description="Students will appear here after registering." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Responses</TableHead>
                  <TableHead>Resume</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="font-mono text-xs">{reg.student_id.slice(0, 8)}...</TableCell>
                    <TableCell className="max-w-xs truncate text-xs">
                      {JSON.stringify(reg.field_responses)}
                    </TableCell>
                    <TableCell>
                      {reg.resume_url ? (
                        <a
                          href={resolveFileUrl(reg.resume_url) ?? '#'}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[var(--color-primary)] hover:underline"
                        >
                          View
                        </a>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{format(new Date(reg.submitted_at), 'PPP')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
