import { useState, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

const DROPDOWN_MENUS = {
  shop: [
    { label: 'DIY/가구',  href: '/shop?type=DIY_FURNITURE' },
    { label: '소형가전',   href: '/shop?type=SMALL_APPLIANCE' },
    { label: '생활잡화',   href: '/shop?type=DAILY_SUPPLIES' },
  ],
  ebook: [
    { label: '무료',  href: '/shop?type=EBOOK&free=true' },
    { label: '유료',  href: '/shop?type=EBOOK&free=false' },
  ],
}

function DropdownNav({ label, items, href }: { label: string; items: { label: string; href: string }[]; href?: string }) {
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
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      <a
        href={href ?? items[0]?.href}
        className="navbar-link"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}
        onClick={e => { if (!href) e.preventDefault() }}
      >
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.55, marginTop: 1 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </a>
      {open && (
        <div
          style={{
            position: 'absolute', top: '100%', left: 0, paddingTop: 6,
            zIndex: 100,
          }}
          onMouseEnter={show}
          onMouseLeave={hide}
        >
          <div style={{
            background: '#fff',
            border: '1px solid #e4e9e4',
            borderRadius: 10,
            boxShadow: '0 8px 24px rgba(0,0,0,0.09)',
            minWidth: 140,
            overflow: 'hidden',
          }}>
            {items.map(item => (
              <a
                key={item.href}
                href={item.href}
                style={{
                  display: 'block', padding: '10px 16px',
                  fontSize: 14, color: '#1a2e1a', textDecoration: 'none',
                  transition: 'background 0.12s',
                  fontFamily: 'var(--font-sans)',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f4f8f4')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'
  const { t, i18n } = useTranslation()
  const { isAuthenticated, user, logout } = useAuth()

  const NAV_LINKS = [
    { label: t('nav.portfolio'),  href: '/#portfolio' },
    { label: t('nav.reviews'),    href: '/#reviews' },
    { label: t('nav.services'),   href: '/#services' },
    { label: t('nav.howItWorks'), href: '/#how-it-works' },
    { label: t('nav.faq'),        href: '/#faq' },
  ]

  const dashboardHref = user?.role === 'ADMIN'
    ? '/admin'
    : user?.role === 'OUTSOURCING_PARTNER'
      ? '/freelancer'
      : '/client'

  function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('/#') && isHome) {
      e.preventDefault()
      const id = href.slice(2)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  function toggleLang() {
    i18n.changeLanguage(i18n.language === 'ko' ? 'en' : 'ko')
  }

  function handleLogout() {
    logout()
    navigate('/')
    setOpen(false)
  }

  return (
    <header className="navbar" role="banner">
      <div className="container">
        <nav className="navbar-inner" aria-label={t('nav.ariaLabel')}>
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label={t('nav.ariaHome')}>
            Ploy
          </Link>

          {/* Desktop nav links */}
          <div className="navbar-links" role="list">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                role="listitem"
                className="navbar-link"
                onClick={(e) => scrollTo(e, link.href)}
              >
                {link.label}
              </a>
            ))}
            <DropdownNav label="상품" href="/shop" items={DROPDOWN_MENUS.shop} />
            <DropdownNav label="전자책" items={DROPDOWN_MENUS.ebook} />
          </div>

          {/* Desktop actions */}
          <div className="navbar-actions">
            {/* Language switcher */}
            <button
              onClick={toggleLang}
              className="navbar-link"
              style={{
                background: 'none', border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-sm)', padding: '4px 10px',
                fontSize: 13, cursor: 'pointer', color: 'var(--text-secondary)',
                fontFamily: 'var(--font-sans)',
              }}
              aria-label={t('lang.switchTo')}
            >
              {i18n.language === 'ko' ? 'EN' : '한'}
            </button>

            {isAuthenticated ? (
              <>
                <Link to={dashboardHref} className="navbar-link">
                  {t('nav.dashboard')}
                </Link>
                <Link to={user?.role === 'ADMIN' ? '/console/notifications' : '/client/notifications'} className="navbar-link" title="알림">
                  🔔
                </Link>
                <button
                  onClick={handleLogout}
                  className="navbar-link"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
                >
                  {t('auth.logout')}
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="navbar-link">
                  {t('nav.login')}
                </Link>
                <Button as="a" href="/register" size="sm">
                  {t('nav.startProject')}
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className={`navbar-hamburger${open ? ' open' : ''}`}
            aria-label={open ? t('nav.ariaCloseMenu') : t('nav.ariaOpenMenu')}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </nav>

        {/* Mobile menu */}
        <div
          id="mobile-menu"
          className={`navbar-mobile-menu${open ? ' open' : ''}`}
          aria-hidden={!open}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="navbar-mobile-link"
              onClick={(e) => scrollTo(e, link.href)}
            >
              {link.label}
            </a>
          ))}
          <a href="/shop" className="navbar-mobile-link" onClick={() => setOpen(false)}>상품</a>
          {DROPDOWN_MENUS.shop.map(item => (
            <a key={item.href} href={item.href} className="navbar-mobile-link" style={{ paddingLeft: 20, fontSize: 14, color: 'var(--text-secondary)' }} onClick={() => setOpen(false)}>
              — {item.label}
            </a>
          ))}
          <span className="navbar-mobile-link" style={{ fontSize: 15, color: 'var(--text-secondary)', display: 'block' }}>전자책</span>
          {DROPDOWN_MENUS.ebook.map(item => (
            <a key={item.href} href={item.href} className="navbar-mobile-link" style={{ paddingLeft: 20, fontSize: 14, color: 'var(--text-secondary)' }} onClick={() => setOpen(false)}>
              — {item.label}
            </a>
          ))}
          <button
            onClick={() => { toggleLang(); setOpen(false) }}
            className="navbar-mobile-link"
            style={{
              background: 'none', border: 'none', textAlign: 'left',
              cursor: 'pointer', fontFamily: 'var(--font-sans)',
              fontSize: 15, color: 'var(--text-secondary)', padding: 0,
            }}
          >
            {i18n.language === 'ko' ? t('lang.en') : t('lang.ko')}
          </button>

          {isAuthenticated ? (
            <>
              <Link
                to={dashboardHref}
                className="navbar-mobile-link"
                onClick={() => setOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
              <button
                onClick={handleLogout}
                className="navbar-mobile-link"
                style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, color: 'var(--text-secondary)', padding: 0 }}
              >
                {t('auth.logout')}
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="navbar-mobile-link"
                onClick={() => setOpen(false)}
              >
                {t('nav.login')}
              </Link>
              <div style={{ paddingTop: 'var(--space-2)' }}>
                <Button as="a" href="/register" size="md" style={{ width: '100%' }}>
                  {t('nav.startProject')}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
