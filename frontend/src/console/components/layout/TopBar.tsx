import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import Breadcrumb from './Breadcrumb'
import { IcMenu, IcSearch, IcBell, IcLogout, IcSettings } from './Icons'
import { getNotifications, retryNotification, type ConsoleNotificationListItem } from '../../api/consoleApi'

interface TopBarProps {
  onMobileMenuClick: () => void
}

const EVENT_LABELS: Record<string, string> = {
  INQUIRY_SUBMITTED: '문의 접수',
  INQUIRY_APPROVED: '문의 승인',
  INQUIRY_REJECTED: '문의 거절',
  DRAFT_UPLOADED: '시안 업로드',
  REVISION_REQUESTED: '수정 요청',
  FINAL_DELIVERY_UPLOADED: '최종 납품',
  PROJECT_COMPLETED: '프로젝트 완료',
  PARTNER_APPROVED: '파트너 승인',
  PARTNER_REJECTED: '파트너 거절',
  MEMBER_REGISTERED: '회원 가입',
}

const STATUS_CLASS: Record<string, { bg: string; color: string; label: string }> = {
  SENT:    { bg: '#ecfdf5', color: '#065f46', label: '발송' },
  PENDING: { bg: '#fefce8', color: '#854d0e', label: '대기' },
  FAILED:  { bg: '#fff1f2', color: '#9f1239', label: '실패' },
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return '방금 전'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  return `${Math.floor(h / 24)}일 전`
}

function NotifPanel({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [items, setItems] = useState<ConsoleNotificationListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [retrying, setRetrying] = useState<number | null>(null)

  useEffect(() => {
    getNotifications(0, 15)
      .then(r => setItems(r.content))
      .finally(() => setLoading(false))
  }, [])

  const handleRetry = async (id: number) => {
    setRetrying(id)
    try {
      const updated = await retryNotification(id)
      setItems(prev => prev.map(n => n.id === updated.id ? updated : n))
    } finally {
      setRetrying(null)
    }
  }

  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 6px)',
      right: 0,
      width: 380,
      maxHeight: 520,
      background: '#fff',
      border: '1px solid var(--cs-border)',
      borderRadius: 'var(--cs-radius)',
      boxShadow: 'var(--cs-shadow-md)',
      zIndex: 200,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--cs-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--cs-text-1)' }}>알림 발송 이력</span>
        <button
          onClick={() => { onClose(); navigate('/console/notifications') }}
          style={{ fontSize: 12, color: 'var(--cs-accent)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          전체 보기 →
        </button>
      </div>

      {/* List */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {loading ? (
          <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--cs-text-3)' }}>불러오는 중...</div>
        ) : items.length === 0 ? (
          <div style={{ padding: 24, textAlign: 'center', fontSize: 13, color: 'var(--cs-text-3)' }}>발송 이력이 없습니다.</div>
        ) : items.map(n => {
          const st = STATUS_CLASS[n.status] ?? STATUS_CLASS.PENDING
          return (
            <div key={n.id} style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--cs-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: 5,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{
                    padding: '2px 8px', borderRadius: 99, fontSize: 11, fontWeight: 600,
                    background: st.bg, color: st.color,
                  }}>{st.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cs-text-1)' }}>
                    {EVENT_LABELS[n.eventType] ?? n.eventType}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: 'var(--cs-text-3)', flexShrink: 0 }}>
                  {timeAgo(n.createdAt)}
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--cs-text-2)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {n.recipientName ? `${n.recipientName} · ` : ''}{n.recipientEmail}
              </div>
              {n.subject && (
                <div style={{ fontSize: 12, color: 'var(--cs-text-3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {n.subject}
                </div>
              )}
              {n.status === 'FAILED' && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: '#e11d48' }}>{n.errorMessage ?? '발송 실패'}</span>
                  <button
                    disabled={retrying === n.id}
                    onClick={() => handleRetry(n.id)}
                    style={{
                      fontSize: 11, padding: '3px 10px', borderRadius: 6,
                      background: '#e11d48', color: '#fff', border: 'none', cursor: 'pointer',
                      opacity: retrying === n.id ? 0.6 : 1,
                    }}
                  >
                    {retrying === n.id ? '재발송 중...' : '재발송'}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function TopBar({ onMobileMenuClick }: TopBarProps) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const notifRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
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
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            className="cs-icon-btn"
            aria-label="알림"
            onClick={() => { setNotifOpen(v => !v); setDropdownOpen(false) }}
          >
            <IcBell size={18} />
            <span className="cs-notif-dot" aria-hidden="true" />
          </button>
          {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} />}
        </div>

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
