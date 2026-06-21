import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { getOpportunity, updateOpportunity } from '@/api/opportunities'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { PageLoader } from '@/components/ui/loading'
import { getErrorMessage } from '@/lib/utils'
import type { Opportunity } from '@/types'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'

function EditOpportunityForm({
  opportunity,
  opportunityId,
}: {
  opportunity: Opportunity
  opportunityId: string
}) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState(opportunity.title)
  const [description, setDescription] = useState(opportunity.description ?? '')
  const [deadline, setDeadline] = useState(
    opportunity.deadline ? new Date(opportunity.deadline).toISOString().slice(0, 16) : '',
  )
  const [status, setStatus] = useState(opportunity.status)

  const mutation = useMutation({
    mutationFn: () =>
      updateOpportunity(opportunityId, {
        title,
        description: description || null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        status,
      }),
    onSuccess: () => {
      toast.success('Opportunity updated')
      queryClient.invalidateQueries({ queryKey: ['opportunity', opportunityId] })
      queryClient.invalidateQueries({ queryKey: ['opportunities'] })
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Update failed')),
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{opportunity.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending ? 'Saving...' : 'Save changes'}
          </Button>
          <Button variant="outline" onClick={() => navigate('/coordinator/opportunities')}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function EditOpportunityPage() {
  const { id } = useParams<{ id: string }>()

  const { data: opportunity, isLoading } = useQuery({
    queryKey: ['opportunity', id],
    queryFn: () => getOpportunity(id!),
    enabled: Boolean(id),
  })

  if (isLoading) return <PageLoader />
  if (!opportunity || !id) return null

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Link
        to="/coordinator/opportunities"
        className="inline-flex items-center gap-1 text-sm text-[var(--color-primary)] hover:underline"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>

      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Opportunity</h1>
      </div>

      <EditOpportunityForm key={opportunity.id} opportunity={opportunity} opportunityId={id} />
    </div>
  )
}
