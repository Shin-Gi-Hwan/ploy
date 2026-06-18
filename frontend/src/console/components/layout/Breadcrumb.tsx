import { Link, useLocation } from 'react-router-dom'
import { ROUTE_LABELS } from '../../types/console'

export default function Breadcrumb() {
  const { pathname } = useLocation()

  // Build segments: /console/users/123 → ['console', 'users', '123']
  const segments = pathname.split('/').filter(Boolean)

  // Build cumulative paths: ['/console', '/console/users', ...]
  const crumbs = segments.map((_, i) => {
    const path = '/' + segments.slice(0, i + 1).join('/')
    const label = ROUTE_LABELS[path] ?? segments[i]
    return { path, label }
  })

  if (crumbs.length <= 1) {
    return (
      <nav className="cs-breadcrumb" aria-label="breadcrumb">
        <span className="cs-breadcrumb-item current">
          {ROUTE_LABELS[pathname] ?? 'Console'}
        </span>
      </nav>
    )
  }

  return (
    <nav className="cs-breadcrumb" aria-label="breadcrumb">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={crumb.path} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {i > 0 && (
              <svg className="cs-breadcrumb-sep" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            )}
            {isLast ? (
              <span className="cs-breadcrumb-item current">{crumb.label}</span>
            ) : (
              <Link to={crumb.path} className="cs-breadcrumb-item">
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
