import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'
import { useAuth } from '../../context/AuthContext'

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
