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

// ─── Admin Console (Phase 1) ──────────────────────────────────────────────────
import ConsoleLayout       from './console/components/layout/ConsoleLayout'
import ConsoleDashboard    from './console/pages/Dashboard'
import ConsoleUsers        from './console/pages/Users'
import ConsolePartners     from './console/pages/Partners'
import ConsoleProducts     from './console/pages/Products'
import ConsoleOrders       from './console/pages/Orders'
import ConsoleInquiries    from './console/pages/Inquiries'
import ConsoleProjects     from './console/pages/Projects'
import ConsoleChatMonitor  from './console/pages/ChatMonitor'
import ConsoleReviews      from './console/pages/Reviews'
import ConsoleNotifications from './console/pages/Notifications'
import ConsoleAuditLogs    from './console/pages/AuditLogs'
import ConsoleSettings     from './console/pages/Settings'

import './index.css'

// ─── Route guards ─────────────────────────────────────────────────────────────

function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (role && user?.role !== role) {
    // Wrong role — redirect to the appropriate home for each role
    const home = user?.role === 'ADMIN' ? '/console'
               : user?.role === 'OUTSOURCING_PARTNER' ? '/freelancer'
               : '/'
    return <Navigate to={home} replace />
  }

  return <>{children}</>
}

function PublicOnly({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <>{children}</>
  // Redirect authenticated users away from public-only pages
  const home = user?.role === 'ADMIN' ? '/console'
             : user?.role === 'OUTSOURCING_PARTNER' ? '/freelancer'
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

      {/* Admin Console (Phase 1) — JWT + ADMIN role required */}
      <Route path="/console" element={<RequireAuth role="ADMIN"><ConsoleLayout /></RequireAuth>}>
        <Route index                  element={<ConsoleDashboard />} />
        <Route path="users"           element={<ConsoleUsers />} />
        <Route path="partners"        element={<ConsolePartners />} />
        <Route path="products"        element={<ConsoleProducts />} />
        <Route path="orders"          element={<ConsoleOrders />} />
        <Route path="inquiries"       element={<ConsoleInquiries />} />
        <Route path="projects"        element={<ConsoleProjects />} />
        <Route path="chat"            element={<ConsoleChatMonitor />} />
        <Route path="reviews"         element={<ConsoleReviews />} />
        <Route path="notifications"   element={<ConsoleNotifications />} />
        <Route path="audit"           element={<ConsoleAuditLogs />} />
        <Route path="settings"        element={<ConsoleSettings />} />
      </Route>

      {/* Legacy admin — uses own Basic Auth system (unchanged) */}
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
