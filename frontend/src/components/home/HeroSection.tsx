import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'

const AVATARS = ['SR', 'DK', 'ML', 'PM', 'JR']

export default function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="container">
        <div className="hero-inner">

          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            {t('hero.badge')}
          </div>

          <h1 id="hero-title" className="hero-title">
            {t('hero.title1')}<br />
            <span className="hero-title-accent">{t('hero.title2')}</span>
          </h1>

          <p className="hero-desc">{t('hero.subtitle')}</p>

          <div className="hero-actions">
            <Button as="a" href="/start" size="lg">
              {t('hero.startProject')}
            </Button>
            <Button as="a" href="/#how-it-works" variant="secondary" size="lg"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {t('hero.seeHow')}
            </Button>
          </div>

          <div className="hero-social-proof">
            <div className="hero-avatars" aria-hidden="true">
              {AVATARS.map((a) => (
                <div key={a} className="hero-avatar">{a[0]}</div>
              ))}
            </div>
            <p className="hero-proof-text">
              {t('hero.trustedBy')} <strong>{t('hero.trustedCount')}</strong> {t('hero.trustedSuffix')}
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
