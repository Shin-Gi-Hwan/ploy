import { useTranslation } from 'react-i18next'
import type { PortfolioMockItem } from '../../lib/mock'

interface Props {
  items: PortfolioMockItem[]
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  PPT:           'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  LOGO:          'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)',
  BUSINESS_CARD: 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
  WEBSITE:       'linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)',
  DETAIL_PAGE:   'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
}

const CATEGORY_ICONS: Record<string, string> = {
  PPT:           '📊',
  LOGO:          '✏️',
  BUSINESS_CARD: '💳',
  WEBSITE:       '🌐',
  DETAIL_PAGE:   '📄',
}

function PortfolioCard({ item }: { item: PortfolioMockItem }) {
  const { t } = useTranslation()
  const gradient = CATEGORY_GRADIENTS[item.category] ?? CATEGORY_GRADIENTS.PPT
  const icon = CATEGORY_ICONS[item.category] ?? '🎨'

  return (
    <article className="portfolio-card">
      {/* Thumbnail */}
      <div className="portfolio-card-thumb">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="portfolio-card-img"
          />
        ) : (
          <div
            className="portfolio-card-placeholder"
            style={{ background: gradient }}
            aria-hidden="true"
          >
            <span className="portfolio-card-icon">{icon}</span>
          </div>
        )}
        {/* Category badge overlay */}
        <span className="portfolio-card-badge">
          {t(`portfolio.category.${item.category}`, item.category)}
        </span>
      </div>

      {/* Body */}
      <div className="portfolio-card-body">
        <h3 className="portfolio-card-title">{item.title}</h3>
        <p className="portfolio-card-desc">{item.description}</p>
        {item.partnerName && (
          <p className="portfolio-card-partner">{item.partnerName}</p>
        )}
      </div>
    </article>
  )
}

export default function PortfolioShowcase({ items }: Props) {
  const { t } = useTranslation()
  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <section id="portfolio" className="portfolio-section" aria-labelledby="portfolio-title">
      <div className="container" style={{ marginBottom: 'var(--space-10)' }}>
        <div className="section-header" style={{ marginBottom: 0 }}>
          <span className="section-label">{t('portfolio.label')}</span>
          <h2 id="portfolio-title" className="section-title">
            {t('portfolio.title')}
          </h2>
          <p className="section-desc">{t('portfolio.subtitle')}</p>
        </div>
      </div>

      {/* Single scrolling row */}
      <div className="portfolio-marquee-container" aria-hidden="true">
        <div className="portfolio-marquee-track">
          {doubled.map((item, i) => (
            <PortfolioCard key={`${item.id}-${i}`} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}
