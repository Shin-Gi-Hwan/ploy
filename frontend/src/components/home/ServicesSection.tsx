import { useTranslation } from 'react-i18next'
import Button from '../ui/Button'

export default function ServicesSection() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true }) as Array<{
    icon: string
    title: string
    desc: string
    days: string
    includes: string[]
  }>

  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('services.label')}</span>
          <h2 id="services-title" className="section-title">
            {t('services.title')}
          </h2>
          <p className="section-desc">{t('services.subtitle')}</p>
        </div>

        <div className="services-grid">
          {items.map((s) => (
            <div key={s.title} className="service-card">
              <div className="service-icon" aria-hidden="true">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>

              <ul style={{
                margin: 'var(--space-5) 0 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                {s.includes.map((item) => (
                  <li key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--mint-500)' }}>
                      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="service-meta">
                <div className="service-meta-item">
                  {t('services.turnaround', { days: s.days })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
          <Button as="a" href="/start" size="lg">
            {t('services.startProject')}
          </Button>
        </div>
      </div>
    </section>
  )
}
