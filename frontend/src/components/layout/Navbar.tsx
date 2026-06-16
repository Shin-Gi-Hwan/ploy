import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Button from '../ui/Button'

const NAV_LINKS = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Services',     href: '/#services' },
  { label: 'Reviews',      href: '/#reviews' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  function scrollTo(e: React.MouseEvent<HTMLAnchorElement>, href: string) {
    if (href.startsWith('/#') && isHome) {
      e.preventDefault()
      const id = href.slice(2)
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  return (
    <header className="navbar" role="banner">
      <div className="container">
        <nav className="navbar-inner" aria-label="Main navigation">
          {/* Logo */}
          <Link to="/" className="navbar-logo" aria-label="Ploy home">
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
              Track Project
            </Link>
            <Button as="a" href="/start" size="sm">
              Start a Project
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className={`navbar-hamburger${open ? ' open' : ''}`}
            aria-label={open ? 'Close menu' : 'Open menu'}
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
            Track Project
          </a>
          <div style={{ paddingTop: 'var(--space-2)' }}>
            <Button as="a" href="/start" size="md" style={{ width: '100%' }}>
              Start a Project
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
