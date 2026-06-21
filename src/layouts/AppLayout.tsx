import { Link, NavLink, Outlet } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils'
import { GraduationCap, LogOut } from 'lucide-react'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]' : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]',
  )

export function AppLayout() {
  const { user, isAuthenticated, isStudent, isCoordinator, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 font-semibold text-[var(--color-primary)]">
            <GraduationCap className="h-6 w-6" />
            CampusHire
          </Link>

          <nav className="flex flex-wrap items-center gap-1">
            <NavLink to="/opportunities" className={navLinkClass}>
              Opportunities
            </NavLink>
            {isStudent && (
              <>
                <NavLink to="/applications" className={navLinkClass}>
                  My Applications
                </NavLink>
                <NavLink to="/profile" className={navLinkClass}>
                  Profile
                </NavLink>
              </>
            )}
            {isCoordinator && (
              <>
                <NavLink to="/coordinator/opportunities" className={navLinkClass}>
                  Manage Opportunities
                </NavLink>
                <NavLink to="/coordinator/applications" className={navLinkClass}>
                  Applications
                </NavLink>
              </>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="hidden text-sm text-[var(--color-muted-foreground)] sm:inline">
                  {user?.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  )
}
