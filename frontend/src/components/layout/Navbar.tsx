import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { t, i18n } = useTranslation()

  const NAV_LINKS = [
    { label: t('nav.howItWorks'), href: '/#how-it-works' },
    { label: t('nav.services'),   href: '/#services' },
    { label: t('nav.reviews'),    href: '/#reviews' },
  ]

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
            <Link to="/track/demo" className="navbar-link">
              {t('nav.trackProject')}
            </Link>
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
            <Button as="a" href="/start" size="sm">
              {t('nav.startProject')}
            </Button>
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
          <a href="/start" className="navbar-mobile-link" onClick={() => setOpen(false)}>
            {t('nav.trackProject')}
          </a>
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
          <div style={{ paddingTop: 'var(--space-2)' }}>
            <Button as="a" href="/start" size="md" style={{ width: '100%' }}>
              {t('nav.startProject')}
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
