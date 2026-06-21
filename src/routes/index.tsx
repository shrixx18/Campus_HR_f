import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { AppLayout } from '@/layouts/AppLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage'
import { ApplicationsPage } from '@/pages/ApplicationsPage'
import { HomePage } from '@/pages/HomePage'
import { LoginPage } from '@/pages/LoginPage'
import { OpportunitiesPage } from '@/pages/OpportunitiesPage'
import { OpportunityDetailPage } from '@/pages/OpportunityDetailPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { RegisterPage } from '@/pages/RegisterPage'
import { CoordinatorApplicationDetailPage } from '@/pages/coordinator/CoordinatorApplicationDetailPage'
import { CoordinatorApplicationsPage } from '@/pages/coordinator/CoordinatorApplicationsPage'
import { CoordinatorOpportunitiesPage } from '@/pages/coordinator/CoordinatorOpportunitiesPage'
import { CreateOpportunityPage } from '@/pages/coordinator/CreateOpportunityPage'
import { EditOpportunityPage } from '@/pages/coordinator/EditOpportunityPage'
import { RegistrationsPage } from '@/pages/coordinator/RegistrationsPage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'opportunities', element: <OpportunitiesPage /> },
      { path: 'opportunities/:id', element: <OpportunityDetailPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <RoleRoute role="student" />,
            children: [
              { path: 'profile', element: <ProfilePage /> },
              { path: 'applications', element: <ApplicationsPage /> },
              { path: 'applications/:id', element: <ApplicationDetailPage /> },
            ],
          },
          {
            element: <RoleRoute role="coordinator" />,
            children: [
              { path: 'coordinator/opportunities', element: <CoordinatorOpportunitiesPage /> },
              { path: 'coordinator/opportunities/new', element: <CreateOpportunityPage /> },
              { path: 'coordinator/opportunities/:id/edit', element: <EditOpportunityPage /> },
              { path: 'coordinator/opportunities/:id/registrations', element: <RegistrationsPage /> },
              { path: 'coordinator/applications', element: <CoordinatorApplicationsPage /> },
              { path: 'coordinator/applications/:id', element: <CoordinatorApplicationDetailPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
