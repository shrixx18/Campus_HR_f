import { Link, Outlet } from 'react-router-dom'
import { GraduationCap } from 'lucide-react'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-xl font-semibold text-[var(--color-primary)]">
            <GraduationCap className="h-7 w-7" />
            CampusHire
          </Link>
          <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
            Campus placement & hiring portal
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
