import type { ReactNode } from 'react'

interface PlaceholderPageProps {
  title: string
  subtitle: string
  icon: ReactNode
  phase?: string
  features?: string[]
}

export default function PlaceholderPage({
  title,
  subtitle,
  icon,
  phase = 'Phase 2',
  features = [],
}: PlaceholderPageProps) {
  return (
    <div>
      {/* Page header */}
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">{title}</h1>
          <p className="cs-page-subtitle">{subtitle}</p>
        </div>
        <span className="cs-badge cs-badge-amber">{phase}에서 구현 예정</span>
      </div>

      {/* Placeholder body */}
      <div className="cs-card" style={{ padding: '60px 24px' }}>
        <div className="cs-placeholder">
          <div className="cs-placeholder-icon">{icon}</div>
          <h2 className="cs-placeholder-title">{title}</h2>
          <p className="cs-placeholder-desc">{subtitle}</p>
          <span className="cs-phase-pill">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            {phase} 구현 예정
          </span>
        </div>

        {features.length > 0 && (
          <div style={{
            marginTop: 40,
            paddingTop: 32,
            borderTop: '1px solid var(--cs-border)',
            maxWidth: 480,
            margin: '40px auto 0',
          }}>
            <p style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cs-text-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>
              구현 예정 기능
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5, color: 'var(--cs-text-2)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--cs-accent)', flexShrink: 0 }} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
