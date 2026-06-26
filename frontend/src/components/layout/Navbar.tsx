import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const SHOP_ITEMS = [
  { label: '전체 상품',    href: '/shop' },
  { label: '명함',         href: '/shop?type=BUSINESS_CARD' },
  { label: '디자인 템플릿', href: '/shop?type=DESIGN_TEMPLATE' },
  { label: '사무용품',     href: '/shop?type=OFFICE_SUPPLY' },
]

const EBOOK_ITEMS = [
  { label: '무료 전자책', href: '/shop?type=EBOOK&free=true' },
  { label: '유료 전자책', href: '/shop?type=EBOOK&free=false' },
]

function DropdownNav({ label, href, items }: { label: string; href: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function show() {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOpen(true)
  }
  function hide() {
    timerRef.current = setTimeout(() => setOpen(false), 120)
  }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={show} onMouseLeave={hide}>
      <Link to={href} style={{
        fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none',
        display: 'inline-flex', alignItems: 'center', gap: 3,
      }}>
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5, marginTop: 1 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 8, zIndex: 200 }}
          onMouseEnter={show} onMouseLeave={hide}>
          <div style={{
            background: '#fff', border: '1px solid #eaf0ef', borderRadius: 10,
            boxShadow: '0 8px 24px rgba(15,46,42,0.10)', minWidth: 150, overflow: 'hidden',
          }}>
            {items.map(item => (
              <Link key={item.href} to={item.href} style={{
                display: 'block', padding: '10px 16px', fontSize: 14,
                color: '#3c4a48', textDecoration: 'none', whiteSpace: 'nowrap',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f4faf9')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated, user, logout } = useAuth()

  const ctaHref = isAuthenticated ? '/client/request' : '/login'

  const dashboardHref = user?.role === 'ADMIN'
    ? '/console'
    : user?.role === 'OUTSOURCING_PARTNER'
      ? '/freelancer'
      : '/client'

  function handleLogout() {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <header style={{
      height: 74, borderBottom: '1px solid #ecf1f0',
      background: '#fff', position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: '0 48px',
        height: '100%', display: 'flex', alignItems: 'center', gap: 40,
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', fontWeight: 800, fontSize: 21, letterSpacing: '-0.01em', color: '#0f2e2a', flexShrink: 0 }}>
          PLOY
        </Link>

        {/* Desktop nav */}
        <nav className="navbar-links" style={{ alignItems: 'center', gap: 28 }}>
          <DropdownNav label="상품" href="/shop" items={SHOP_ITEMS} />
          <DropdownNav label="전자책" href="/shop?type=EBOOK" items={EBOOK_ITEMS} />
          <Link to="/partners" style={{ fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none' }}>포트폴리오</Link>
          <a href="/#how-it-works" style={{ fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none' }}>이용 방법</a>
        </nav>

        {/* Desktop actions */}
        <div className="navbar-actions" style={{ marginLeft: 'auto', alignItems: 'center', gap: 18 }}>
          {isAuthenticated ? (
            <>
              <Link to={dashboardHref} style={{ fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none' }}>대시보드</Link>
              <button onClick={handleLogout} style={{
                fontSize: 15, color: '#3c4a48', fontWeight: 500, background: 'none',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit', padding: 0,
              }}>로그아웃</button>
            </>
          ) : (
            <Link to="/login" style={{ fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none' }}>로그인</Link>
          )}
          <Link to={ctaHref} style={{
            fontSize: 15, fontWeight: 600, color: '#fff', background: '#2ec4b6',
            padding: '10px 20px', borderRadius: 8, textDecoration: 'none',
          }}>의뢰하기</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="navbar-hamburger"
          style={{ marginLeft: 'auto' }}
          aria-label="메뉴"
          onClick={() => setOpen(v => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'absolute', top: 74, left: 0, right: 0,
          background: '#fff', borderTop: '1px solid #ecf1f0',
          borderBottom: '1px solid #ecf1f0',
          padding: '16px 20px 20px', display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 99,
        }}>
          {[
            { label: '상품', href: '/shop' },
            { label: '전자책', href: '/shop?type=EBOOK' },
            { label: '포트폴리오', href: '/partners' },
            { label: '이용 방법', href: '/#how-it-works' },
          ].map(item => (
            <Link key={item.href} to={item.href}
              onClick={() => setOpen(false)}
              style={{ padding: '10px 4px', fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none', borderRadius: 8 }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ height: 1, background: '#f0f4f3', margin: '8px 0' }} />
          {isAuthenticated ? (
            <>
              <Link to={dashboardHref} onClick={() => setOpen(false)}
                style={{ padding: '10px 4px', fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none' }}>
                대시보드
              </Link>
              <button onClick={handleLogout}
                style={{ padding: '10px 4px', fontSize: 15, color: '#3c4a48', fontWeight: 500, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                로그아웃
              </button>
            </>
          ) : (
            <Link to="/login" onClick={() => setOpen(false)}
              style={{ padding: '10px 4px', fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none' }}>
              로그인
            </Link>
          )}
          <Link to={ctaHref} onClick={() => setOpen(false)}
            style={{ marginTop: 8, padding: '12px 20px', fontSize: 15, fontWeight: 600, color: '#fff', background: '#2ec4b6', borderRadius: 8, textDecoration: 'none', textAlign: 'center' }}>
            의뢰하기
          </Link>
        </div>
      )}
    </header>
  )
}
