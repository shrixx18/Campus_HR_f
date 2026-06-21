import { cn } from '@/lib/utils'

const statusStyles: Record<string, string> = {
  Applied: 'bg-blue-100 text-blue-800',
  Shortlisted: 'bg-purple-100 text-purple-800',
  Assessment: 'bg-amber-100 text-amber-800',
  'Technical Interview': 'bg-indigo-100 text-indigo-800',
  'HR Interview': 'bg-cyan-100 text-cyan-800',
  Selected: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
  Withdrawn: 'bg-slate-100 text-slate-600',
  published: 'bg-green-100 text-green-800',
  draft: 'bg-slate-100 text-slate-600',
  closed: 'bg-red-100 text-red-800',
}

interface BadgeProps {
  children: React.ReactNode
  className?: string
  variant?: keyof typeof statusStyles | 'default'
}

export function Badge({ children, className, variant = 'default' }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variant !== 'default' && statusStyles[variant] ? statusStyles[variant] : 'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)]',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function StatusBadge({ status }: { status: string }) {
  return <Badge variant={status in statusStyles ? (status as keyof typeof statusStyles) : 'default'}>{status}</Badge>
}
