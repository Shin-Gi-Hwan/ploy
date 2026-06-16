import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  const { t } = useTranslation()

  return (
    <nav aria-label={t('common.breadcrumbAria')}>
      <ol className="breadcrumb">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className={`breadcrumb-item${isLast ? ' current' : ''}`}>
              {!isLast && item.href ? (
                <Link to={item.href}>{item.label}</Link>
              ) : (
                <span>{item.label}</span>
              )}
              {!isLast && (
                <svg
                  className="breadcrumb-sep"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
