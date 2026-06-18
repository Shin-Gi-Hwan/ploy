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

import './index.css'

// ─── Route guards ─────────────────────────────────────────────────────────────

function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && user?.role !== role) {
    // Wrong role — send to their own dashboard
    const home = user?.role === 'ADMIN' ? '/admin'
               : user?.role === 'FREELANCER' ? '/freelancer'
               : '/client'
    return <Navigate to={home} replace />
  }

  return <>{children}</>
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <>{children}</>
  const home = user?.role === 'ADMIN' ? '/admin'
             : user?.role === 'FREELANCER' ? '/freelancer'
             : '/client'
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

      {/* Client dashboard */}
      <Route path="/client/*" element={
        <RequireAuth role="CLIENT">
          <Routes>
            <Route index element={<ClientDashboard />} />
            {/* Placeholder sub-routes — pages added in future phases */}
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

      {/* Freelancer dashboard */}
      <Route path="/freelancer/*" element={
        <RequireAuth role="FREELANCER">
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
