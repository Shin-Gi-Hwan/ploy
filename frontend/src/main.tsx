import './i18n'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes, Navigate, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import type { UserRole } from './types/api'

import Home              from './pages/Home'
import Intake            from './pages/Intake'
import Tracking          from './pages/Tracking'
import Admin             from './pages/Admin'
import Login             from './pages/Login'
import Register          from './pages/Register'
import ClientDashboard   from './pages/client/Dashboard'
import FreelancerDashboard from './pages/freelancer/Dashboard'
import Partners          from './pages/Partners'
import PartnerDetail     from './pages/PartnerDetail'
import PartnerApply      from './pages/PartnerApply'

import './index.css'

// ─── Route guards ─────────────────────────────────────────────────────────────

function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && user?.role !== role) {
    // Wrong role — FREELANCER/ADMIN go to their dashboard, regular users go home
    const home = user?.role === 'ADMIN' ? '/admin'
               : user?.role === 'OUTSOURCING_PARTNER' ? '/freelancer'
               : '/'
    return <Navigate to={home} replace />
  }

  return <>{children}</>
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <>{children}</>
  // FREELANCER/ADMIN go to their dashboard; regular users go to home
  const home = user?.role === 'ADMIN' ? '/admin'
             : user?.role === 'FREELANCER' ? '/freelancer'
             : '/'
  return <Navigate to={home} replace />
}

// ─── App ──────────────────────────────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"             element={<Home />} />
      <Route path="/track/:token" element={<Tracking />} />

      {/* Auth — redirect away if already logged in */}
      <Route path="/login"    element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register" element={<PublicOnly><Register /></PublicOnly>} />

      {/* Legacy intake — keep accessible but prefer /client/request */}
      <Route path="/start" element={<Intake />} />

      {/* Public partner pages */}
      <Route path="/partners"     element={<Partners />} />
      <Route path="/partners/:id" element={<PartnerDetail />} />
      <Route path="/partner/apply" element={<RequireAuth><PartnerApply /></RequireAuth>} />

      {/* Client dashboard */}
      <Route path="/client/*" element={
        <RequireAuth role="USER">
          <Routes>
            <Route index element={<ClientDashboard />} />
            <Route path="projects"  element={<ClientDashboard />} />
            <Route path="request"   element={<ClientDashboard />} />
            <Route path="orders"    element={<ClientDashboard />} />
            <Route path="messages"  element={<ClientDashboard />} />
            <Route path="files"     element={<ClientDashboard />} />
            <Route path="reviews"   element={<ClientDashboard />} />
            <Route path="settings"  element={<ClientDashboard />} />
          </Routes>
        </RequireAuth>
      } />

      {/* Partner dashboard */}
      <Route path="/freelancer/*" element={
        <RequireAuth role="OUTSOURCING_PARTNER">
          <Routes>
            <Route index element={<FreelancerDashboard />} />
          </Routes>
        </RequireAuth>
      } />

      {/* Admin — uses own Basic Auth system (existing) */}
      <Route path="/admin" element={<Admin />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
