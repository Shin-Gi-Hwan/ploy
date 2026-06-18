import { NavLink, useLocation } from 'react-router-dom'
import { NAV_GROUPS } from '../../types/console'
import { NavIcon, IcChevronLeft } from './Icons'

interface SidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  onToggle: () => void
  onMobileClose: () => void
}

function PloyMark() {
  return (
    <svg className="cs-logo-mark" viewBox="0 0 26 26" fill="none">
      {/* Back rect — dark green */}
      <rect x="4" y="10" width="18" height="7" rx="2" fill="#1b3d2a" />
      {/* Mid rect — teal */}
      <rect x="4" y="6" width="18" height="7" rx="2" fill="#2dba9a" />
      {/* Front rect — mint */}
      <rect x="4" y="2" width="18" height="7" rx="2" fill="#3DD9B3" />
    </svg>
  )
}

export default function Sidebar({ collapsed, mobileOpen, onToggle, onMobileClose }: SidebarProps) {
  const location = useLocation()

  function isActive(path: string, exact?: boolean) {
    if (exact) return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`cs-overlay${mobileOpen ? '' : ' hidden'}`}
        onClick={onMobileClose}
        aria-hidden="true"
      />

      <aside className={`cs-sidebar${collapsed ? ' collapsed' : ''}${mobileOpen ? ' mobile-open' : ''}`}>

        {/* Logo */}
        <a href="/console" className="cs-logo" title="Ploy Console">
          <PloyMark />
          <div className="cs-logo-text">
            <span className="cs-logo-name">PLOY</span>
            <span className="cs-logo-sub">Admin Console</span>
          </div>
        </a>

        {/* Nav groups */}
        <nav className="cs-nav" aria-label="Console navigation">
          {NAV_GROUPS.map(group => (
            <div key={group.label} className="cs-nav-group">
              <div className="cs-nav-group-label">{group.label}</div>
              {group.items.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`cs-nav-item${isActive(item.path, item.exact) ? ' active' : ''}`}
                  onClick={onMobileClose}
                  title={collapsed ? item.label : undefined}
                >
                  <span className="cs-nav-icon">
                    <NavIcon icon={item.icon} size={17} />
                  </span>
                  <span className="cs-nav-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className="cs-sidebar-footer">
          <button
            className="cs-collapse-btn"
            onClick={onToggle}
            aria-label={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
            title={collapsed ? '사이드바 펼치기' : '사이드바 접기'}
          >
            <span className="cs-nav-icon cs-collapse-icon">
              <IcChevronLeft size={16} />
            </span>
            <span className="cs-collapse-label" style={{ fontSize: 13 }}>사이드바 접기</span>
          </button>
        </div>
      </aside>
    </>
  )
}
