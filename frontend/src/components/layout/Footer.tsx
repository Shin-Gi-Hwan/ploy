import { Link } from 'react-router-dom'

const LINKS = [
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Services',     href: '/#services' },
  { label: 'Start a Project', href: '/start' },
  { label: 'Track Project',   href: '/track' },
]

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <Link to="/" className="footer-logo">Ploy</Link>
              <p className="footer-tagline" style={{ marginTop: 'var(--space-3)' }}>
                Done-for-you design work.<br />
                Business cards, decks, and websites — delivered.
              </p>
            </div>
            <nav aria-label="Footer navigation">
              <div className="footer-links">
                {LINKS.map((l) => (
                  <Link key={l.href} to={l.href} className="footer-link">
                    {l.label}
                  </Link>
                ))}
              </div>
            </nav>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} Ploy. All rights reserved.</span>
            <span>Designed work, handled professionally.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
