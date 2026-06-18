import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../context/AuthContext'

// ─── Nav items per role ───────────────────────────────────────────────────────

interface NavItem {
  to: string
  icon: string
  labelKey: string
}

const CLIENT_NAV: NavItem[] = [
  { to: '/client',           icon: '◻',  labelKey: 'dashboard.nav.overview' },
  { to: '/client/projects',  icon: '📋', labelKey: 'dashboard.nav.myProjects' },
  { to: '/client/request',   icon: '＋',  labelKey: 'dashboard.nav.newRequest' },
  { to: '/client/orders',    icon: '🛍',  labelKey: 'dashboard.nav.orders' },
  { to: '/client/messages',  icon: '💬', labelKey: 'dashboard.nav.messages' },
  { to: '/client/files',     icon: '📁', labelKey: 'dashboard.nav.files' },
  { to: '/client/reviews',   icon: '⭐', labelKey: 'dashboard.nav.reviews' },
  { to: '/client/settings',  icon: '⚙',  labelKey: 'dashboard.nav.settings' },
]

const FREELANCER_NAV: NavItem[] = [
  { to: '/freelancer',              icon: '◻',  labelKey: 'dashboard.nav.overview' },
  { to: '/freelancer/projects',     icon: '📋', labelKey: 'dashboard.nav.assignedProjects' },
  { to: '/freelancer/deliverables', icon: '📁', labelKey: 'dashboard.nav.deliverables' },
  { to: '/freelancer/messages',     icon: '💬', labelKey: 'dashboard.nav.messages' },
]

const ADMIN_NAV: NavItem[] = [
  { to: '/admin',               icon: '◻',  labelKey: 'dashboard.nav.overview' },
  { to: '/admin/requests',      icon: '📥', labelKey: 'dashboard.nav.serviceRequests' },
  { to: '/admin/projects',      icon: '📋', labelKey: 'dashboard.nav.projects' },
  { to: '/admin/users',         icon: '👥', labelKey: 'dashboard.nav.users' },
  { to: '/admin/products',      icon: '📦', labelKey: 'dashboard.nav.products' },
  { to: '/admin/orders',        icon: '🛍',  labelKey: 'dashboard.nav.orders' },
  { to: '/admin/reviews',       icon: '⭐', labelKey: 'dashboard.nav.reviews' },
  { to: '/admin/analytics',     icon: '📊', labelKey: 'dashboard.nav.analytics' },
]

function getNavItems(role: string | undefined): NavItem[] {
  if (role === 'FREELANCER') return FREELANCER_NAV
  if (role === 'ADMIN')      return ADMIN_NAV
  return CLIENT_NAV
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  children: ReactNode
  title?: string
}

export default function DashboardLayout({ children, title }: Props) {
  const { t } = useTranslation()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = getNavItems(user?.role)

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const roleLabel = user?.role === 'ADMIN'
    ? t('dashboard.roleAdmin')
    : user?.role === 'FREELANCER'
      ? t('dashboard.roleFreelancer')
      : t('dashboard.roleClient')

  return (
    <div className="dash-shell">
      {/* ── Sidebar ── */}
      <aside className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="dash-sidebar-header">
          <a href="/" className="dash-logo">Ploy</a>
          <button
            className="dash-sidebar-close"
            onClick={() => setSidebarOpen(false)}
            aria-label={t('common.close')}
          >✕</button>
        </div>

        <nav className="dash-nav" aria-label={t('dashboard.navAria')}>
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/client' || item.to === '/freelancer' || item.to === '/admin'}
              className={({ isActive }) => `dash-nav-item${isActive ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="dash-nav-icon" aria-hidden="true">{item.icon}</span>
              <span>{t(item.labelKey)}</span>
            </NavLink>
          ))}
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user-info">
            <div className="dash-avatar">{user?.name.charAt(0).toUpperCase()}</div>
            <div className="dash-user-meta">
              <span className="dash-user-name">{user?.name}</span>
              <span className="dash-user-role">{roleLabel}</span>
            </div>
          </div>
          <button className="dash-logout-btn" onClick={handleLogout}>
            {t('auth.logout')}
          </button>
        </div>
      </aside>

      {/* ── Overlay (mobile) ── */}
      {sidebarOpen && (
        <div
          className="dash-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Main ── */}
      <div className="dash-main">
        <header className="dash-topbar">
          <button
            className="dash-hamburger"
            onClick={() => setSidebarOpen(true)}
            aria-label={t('common.openMenu')}
          >
            <span /><span /><span />
          </button>
          {title && <h1 className="dash-page-title">{title}</h1>}
          <div className="dash-topbar-right">
            <span className="dash-topbar-user">{user?.name}</span>
          </div>
        </header>

        <main className="dash-content">
          {children}
        </main>
      </div>
    </div>
  )
}
