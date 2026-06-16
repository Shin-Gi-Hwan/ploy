import { useTranslation } from 'react-i18next'

export default function CtaSection() {
  const { t } = useTranslation()

  return (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-box">
          <p className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {t('cta.label')}
          </p>
          <h2 id="cta-title" className="cta-title">
            {t('cta.title1')}<br />{t('cta.title2')}
          </h2>
          <p className="cta-desc">
            {t('cta.subtitle1')}<br />
            {t('cta.subtitle2')}
          </p>
          <div className="cta-actions">
            <a href="/start" className="btn btn-lg btn-cta-primary">
              {t('cta.startProject')}
            </a>
            <a
              href="/#how-it-works"
              className="btn btn-lg btn-cta-secondary"
              onClick={(e: React.MouseEvent) => {
                e.preventDefault()
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              {t('cta.seeHow')}
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
