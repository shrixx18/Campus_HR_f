import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { createOpportunity } from '@/api/opportunities'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FormFieldBuilder } from '@/features/opportunities/FormFieldBuilder'
import { getErrorMessage } from '@/lib/utils'
import type { FormFieldCreate } from '@/types'

export function CreateOpportunityPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [deadline, setDeadline] = useState('')
  const [formFields, setFormFields] = useState<FormFieldCreate[]>([])
  const [minCgpa, setMinCgpa] = useState('')
  const [allowedBranches, setAllowedBranches] = useState('')

  const mutation = useMutation({
    mutationFn: () => {
      const eligibility_rules: Record<string, unknown>[] = []
      if (minCgpa) eligibility_rules.push({ min_cgpa: Number(minCgpa) })
      if (allowedBranches.trim()) {
        eligibility_rules.push({
          allowed_branches: allowedBranches.split(',').map((b) => b.trim()).filter(Boolean),
        })
      }

      return createOpportunity({
        title,
        description: description || null,
        deadline: deadline ? new Date(deadline).toISOString() : null,
        form_fields: formFields.filter((f) => f.label.trim()),
        eligibility_rules,
      })
    },
    onSuccess: (opp) => {
      toast.success('Opportunity created!')
      navigate(`/coordinator/opportunities/${opp.id}/edit`)
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to create opportunity')),
  })

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Opportunity</h1>
        <p className="mt-1 text-[var(--color-muted-foreground)]">
          Set up a new placement or internship opening
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Opportunity details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <Input id="deadline" type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
          </div>

          <div className="space-y-4 rounded-lg border border-[var(--color-border)] p-4">
            <h3 className="font-medium">Eligibility rules</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="minCgpa">Minimum CGPA</Label>
                <Input id="minCgpa" type="number" step="0.01" value={minCgpa} onChange={(e) => setMinCgpa(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branches">Allowed branches (comma-separated)</Label>
                <Input id="branches" placeholder="CSE, ECE, IT" value={allowedBranches} onChange={(e) => setAllowedBranches(e.target.value)} />
              </div>
            </div>
          </div>

          <FormFieldBuilder fields={formFields} onChange={setFormFields} />

          <div className="flex gap-2">
            <Button onClick={() => mutation.mutate()} disabled={!title.trim() || mutation.isPending}>
              {mutation.isPending ? 'Creating...' : 'Create opportunity'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/coordinator/opportunities')}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
