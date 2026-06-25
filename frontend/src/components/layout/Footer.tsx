import { Link } from 'react-router-dom'

const FOOTER_LINKS = [
  { label: '상품',     href: '/shop' },
  { label: '전자책',   href: '/shop?type=EBOOK' },
  { label: '포트폴리오', href: '/partners' },
  { label: '이용 방법', href: '/#how-it-works' },
  { label: '의뢰 시작', href: '/client/request' },
]

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid #ecf1f0', padding: '36px 48px', background: '#fff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'flex-start', justifyContent: 'space-between' }}>

        {/* Brand */}
        <div>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: '#2ec4b6', flexShrink: 0 }} />
            <span style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: '#0f2e2a' }}>PLOY</span>
          </Link>
          <p style={{ marginTop: 10, fontSize: 13, color: '#9cafac', lineHeight: 1.6 }}>
            목적에 맞는 결과물을,<br />검증된 전문가와 함께.
          </p>
        </div>

        {/* Links */}
        <nav style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
          {FOOTER_LINKS.map(l => (
            <Link key={l.href} to={l.href} style={{ fontSize: 14, color: '#6b7976', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#2ec4b6')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6b7976')}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <div style={{ width: '100%', paddingTop: 24, borderTop: '1px solid #f0f4f3', fontSize: 13, color: '#9cafac' }}>
          © {new Date().getFullYear()} PLOY. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
