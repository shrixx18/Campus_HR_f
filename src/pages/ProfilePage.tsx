import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { getProfile, updateProfile } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PageLoader } from '@/components/ui/loading'
import { useAuth } from '@/hooks/useAuth'
import { getErrorMessage } from '@/lib/utils'
import type { Profile } from '@/types'

type ProfileForm = {
  name: string
  cgpa: string
  branch: string
  year: string
  phone: string
  skills: string
}

export function ProfilePage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => getProfile(user!.id),
    enabled: Boolean(user?.id),
  })

  const { register, handleSubmit, reset } = useForm<ProfileForm>()

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name ?? '',
        cgpa: profile.cgpa?.toString() ?? '',
        branch: profile.branch ?? '',
        year: profile.year?.toString() ?? '',
        phone: profile.phone ?? '',
        skills: profile.skills?.join(', ') ?? '',
      })
    }
  }, [profile, reset])

  const mutation = useMutation({
    mutationFn: (data: ProfileForm) =>
      updateProfile({
        name: data.name || null,
        cgpa: data.cgpa ? Number(data.cgpa) : null,
        branch: data.branch || null,
        year: data.year ? Number(data.year) : null,
        phone: data.phone || null,
        skills: data.skills
          ? data.skills.split(',').map((s) => s.trim()).filter(Boolean)
          : null,
      }),
    onSuccess: (updated: Profile) => {
      queryClient.setQueryData(['profile', user?.id], updated)
      toast.success('Profile updated')
    },
    onError: (err) => toast.error(getErrorMessage(err, 'Failed to update profile')),
  })

  if (isLoading) return <PageLoader />

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="mt-1 text-[var(--color-muted-foreground)]">
          Keep your profile up to date for eligibility checks and applications
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student profile</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full name</Label>
                <Input id="name" {...register('name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cgpa">CGPA</Label>
                <Input id="cgpa" type="number" step="0.01" min="0" max="10" {...register('cgpa')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Input id="branch" placeholder="e.g. CSE" {...register('branch')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input id="year" type="number" min="1" max="5" {...register('year')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" {...register('phone')} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input id="skills" placeholder="React, Python, SQL" {...register('skills')} />
              </div>
            </div>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Saving...' : 'Save profile'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
