import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import Breadcrumb from './Breadcrumb'
import { IcMenu, IcSearch, IcBell, IcLogout, IcSettings } from './Icons'

interface TopBarProps {
  onMobileMenuClick: () => void
}

export default function TopBar({ onMobileMenuClick }: TopBarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  const initials = user?.name
    ? user.name.slice(0, 2).toUpperCase()
    : 'AD'

  return (
    <header className="cs-topbar">
      {/* Left */}
      <div className="cs-topbar-left">
        <button
          className="cs-mobile-toggle"
          onClick={onMobileMenuClick}
          aria-label="메뉴 열기"
        >
          <IcMenu size={20} />
        </button>
        <Breadcrumb />
      </div>

      {/* Right */}
      <div className="cs-topbar-right">
        {/* Search */}
        <div className="cs-search">
          <span style={{ color: 'var(--cs-text-3)', flexShrink: 0, display: 'flex' }}><IcSearch size={14} /></span>
          <input
            type="search"
            placeholder="빠른 검색..."
            aria-label="빠른 검색"
          />
        </div>

        {/* Notification bell */}
        <button className="cs-icon-btn" aria-label="알림">
          <IcBell size={18} />
          <span className="cs-notif-dot" aria-hidden="true" />
        </button>

        {/* Admin profile dropdown */}
        <div style={{ position: 'relative' }} ref={dropdownRef}>
          <button
            className="cs-admin-btn"
            onClick={() => setDropdownOpen(v => !v)}
            aria-label="관리자 메뉴"
          >
            <div className="cs-avatar">{initials}</div>
            <span className="cs-admin-name">{user?.name ?? 'Admin'}</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2" style={{ color: 'var(--cs-text-3)' }}>
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>

          {dropdownOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              minWidth: 180,
              background: 'white',
              border: '1px solid var(--cs-border)',
              borderRadius: 'var(--cs-radius)',
              boxShadow: 'var(--cs-shadow-md)',
              overflow: 'hidden',
              zIndex: 200,
            }}>
              {/* User info */}
              <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--cs-border)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--cs-text-1)' }}>
                  {user?.name ?? 'Admin'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--cs-text-3)', marginTop: 2 }}>
                  {user?.email}
                </div>
                <span className="cs-badge cs-badge-mint" style={{ marginTop: 6, fontSize: 11 }}>
                  ADMIN
                </span>
              </div>

              {/* Actions */}
              <button
                onClick={() => { setDropdownOpen(false); navigate('/console/settings') }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 14px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: 'var(--cs-text-1)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--cs-bg)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <IcSettings size={15} />
                설정
              </button>

              <button
                onClick={handleLogout}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', padding: '10px 14px',
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 13, color: '#E11D48',
                  borderTop: '1px solid var(--cs-border)',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FFF1F2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}
              >
                <IcLogout size={15} />
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
