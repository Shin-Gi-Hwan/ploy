import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()

  const LINKS = [
    { label: t('footer.links.howItWorks'),  href: '/#how-it-works' },
    { label: t('footer.links.services'),    href: '/#services' },
    { label: t('footer.links.startProject'), href: '/start' },
    { label: t('footer.links.trackProject'), href: '/track' },
  ]

  return (
    <footer className="footer" role="contentinfo">
      <div className="container">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <Link to="/" className="footer-logo">Ploy</Link>
              <p className="footer-tagline" style={{ marginTop: 'var(--space-3)' }}>
                {t('footer.tagline1')}<br />
                {t('footer.tagline2')}
              </p>
            </div>
            <nav aria-label={t('footer.ariaNav')}>
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
            <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
            <span>{t('footer.designed')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
