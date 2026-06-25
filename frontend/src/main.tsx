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
import ClientDashboard      from './pages/client/Dashboard'
import ClientProjects       from './pages/client/Projects'
import ClientProjectDetail  from './pages/client/ProjectDetail'
import ClientRequest        from './pages/client/Request'
import ClientOrders         from './pages/client/Orders'
import ClientMessages       from './pages/client/Messages'
import ClientFiles          from './pages/client/Files'
import ClientReviews        from './pages/client/Reviews'
import ClientSettings       from './pages/client/Settings'
import ClientNotifications  from './pages/client/Notifications'
import FreelancerDashboard  from './pages/freelancer/Dashboard'
import Partners             from './pages/Partners'
import PartnerDetail        from './pages/PartnerDetail'
import PartnerApply         from './pages/PartnerApply'
import OAuthCallback        from './pages/OAuthCallback'
import Shop                 from './pages/Shop'
import ProductDetail        from './pages/ProductDetail'

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
import ConsoleLoginAudits  from './console/pages/LoginAudits'
import ConsoleAuditLogs    from './console/pages/AuditLogs'
import ConsoleSettings     from './console/pages/Settings'

import './index.css'

// ─── Route guards ─────────────────────────────────────────────────────────────

function RequireAuth({ children, role }: { children: React.ReactNode; role?: UserRole }) {
  const { isAuthenticated, user } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname + location.search }} replace />
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
      <Route path="/login"          element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/register"       element={<PublicOnly><Register /></PublicOnly>} />
      {/* OAuth2 social login callback — backend redirects here with JWT in URL */}
      <Route path="/oauth2/success" element={<OAuthCallback />} />

      {/* Legacy intake — keep accessible but prefer /client/request */}
      <Route path="/start" element={<Intake />} />

      {/* Public shop */}
      <Route path="/shop" element={<Shop />} />
      <Route path="/shop/:id" element={<ProductDetail />} />

      {/* Public partner pages */}
      <Route path="/partners"     element={<Partners />} />
      <Route path="/partners/:id" element={<PartnerDetail />} />
      <Route path="/partner/apply" element={<RequireAuth><PartnerApply /></RequireAuth>} />

      {/* Client dashboard */}
      <Route path="/client/*" element={
        <RequireAuth role="USER">
          <Routes>
            <Route index                    element={<ClientDashboard />} />
            <Route path="notifications"     element={<ClientNotifications />} />
            <Route path="projects"          element={<ClientProjects />} />
            <Route path="projects/:id"      element={<ClientProjectDetail />} />
            <Route path="request"           element={<ClientRequest />} />
            <Route path="orders"            element={<ClientOrders />} />
            <Route path="messages"          element={<ClientMessages />} />
            <Route path="files"             element={<ClientFiles />} />
            <Route path="reviews"           element={<ClientReviews />} />
            <Route path="settings"          element={<ClientSettings />} />
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

        <Route path="login-audits"    element={<ConsoleLoginAudits />} />
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
