import { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const SHOP_ITEMS = [
  { label: '전체 상품',     href: '/shop' },
  { label: '명함',          href: '/shop?type=BUSINESS_CARD' },
  { label: '디자인 템플릿',  href: '/shop?type=DESIGN_TEMPLATE' },
  { label: '사무용품',      href: '/shop?type=OFFICE_SUPPLY' },
]

const EBOOK_ITEMS = [
  { label: '무료 전자책', href: '/shop?type=EBOOK&free=true' },
  { label: '유료 전자책', href: '/shop?type=EBOOK&free=false' },
]

function NavDropdown({ label, href, items }: { label: string; href: string; items: { label: string; href: string }[] }) {
  const [open, setOpen] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = () => { if (timer.current) clearTimeout(timer.current); setOpen(true) }
  const hide = () => { timer.current = setTimeout(() => setOpen(false), 120) }

  return (
    <div style={{ position: 'relative' }} onMouseEnter={show} onMouseLeave={hide}>
      <Link to={href} style={{ fontSize: 15, color: '#3c4a48', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 3 }}>
        {label}
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" style={{ opacity: 0.5, marginTop: 1 }}>
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </Link>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, paddingTop: 8, zIndex: 200 }}
          onMouseEnter={show} onMouseLeave={hide}>
          <div style={{ background: '#fff', border: '1px solid #eaf0ef', borderRadius: 10, boxShadow: '0 8px 24px rgba(15,46,42,0.10)', minWidth: 150, overflow: 'hidden' }}>
            {items.map(item => (
              <Link key={item.href} to={item.href}
                style={{ display: 'block', padding: '10px 16px', fontSize: 14, color: '#3c4a48', textDecoration: 'none', whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f4faf9')}
                onMouseLeave={e => (e.currentTarget.style.background = '')}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const COL_A = [
  { text: '제안서 하나 바꿨을 뿐인데 미팅 성사율이 달라졌어요. 첫인상이 결과를 바꾼다는 말, 진짜였습니다.', name: '김OO 대표', type: 'PPT · 제안서 의뢰' },
  { text: '로고부터 명함까지 톤을 맞춰 받았어요. 브랜드 첫인상이 확실히 정돈된 느낌이라 재의뢰했습니다.', name: '박OO 실장', type: '로고 · 브랜딩 의뢰' },
  { text: '웹사이트 디자인이 완성된 후 고객 문의가 눈에 띄게 늘었어요. 퀄리티 대비 가격이 합리적입니다.', name: '정OO 대표', type: '웹사이트 의뢰' },
  { text: '전자책 레이아웃이 너무 깔끔하게 나왔어요. 독자 반응도 좋고 재구매율도 올랐습니다.', name: '최OO 작가', type: '전자책 의뢰' },
]

const COL_B = [
  { text: '상세페이지를 새로 만들고 구매 전환율이 눈에 띄게 올랐습니다. 흐름 설계까지 챙겨주셔서 만족해요.', name: '이OO 마케터', type: '상세페이지 의뢰' },
  { text: '명함 하나가 이렇게 달라 보일 줄 몰랐어요. 거래처 반응이 확실히 달라졌습니다.', name: '윤OO 팀장', type: '명함 의뢰' },
  { text: '브랜딩 작업을 맡겼는데 생각보다 훨씬 빠르게, 원하던 방향 그대로 완성돼서 놀랐어요.', name: '강OO 대표', type: '브랜딩 의뢰' },
  { text: 'PPT 발표 자료를 맡겼는데 시각적 완성도가 높아서 임원진 반응이 좋았습니다. 재의뢰 예정이에요.', name: '조OO 팀장', type: 'PPT 의뢰' },
]

const COL_C = [
  { text: '처음엔 반신반의했는데 결과물 보고 바로 추가 의뢰했어요. 디테일이 살아 있어서 만족스럽습니다.', name: '한OO 대표', type: '상세페이지 의뢰' },
  { text: '커뮤니케이션이 원활하고 수정 요청도 빠르게 반영돼서 스트레스 없이 진행했어요.', name: '오OO 실장', type: '로고 의뢰' },
  { text: '인스타그램 카드뉴스 디자인을 의뢰했는데 팔로워 반응이 이전과 확연히 달라졌습니다.', name: '서OO 마케터', type: '콘텐츠 디자인 의뢰' },
  { text: '발표 자료가 달라지니 투자자 미팅 분위기가 달랐어요. 첫인상의 힘을 실감했습니다.', name: '임OO 대표', type: 'IR 자료 의뢰' },
]

export default function Home() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const ctaHref = isAuthenticated ? '/client/request' : '/login'
  const [searchQuery, setSearchQuery] = useState('')

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    navigate(isAuthenticated ? '/client/request' : '/login')
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0eee9; }
        .ploy-page { background: #fff; }

        /* Header */
        .ploy-header { height: 74px; border-bottom: 1px solid #ecf1f0; display: flex; align-items: center; background: #fff; position: sticky; top: 0; z-index: 100; }
        .ploy-header-inner { max-width: 1240px; margin: 0 auto; padding: 0 48px; width: 100%; display: flex; align-items: center; gap: 40px; }
        .ploy-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
        .ploy-logo-icon { width: 28px; height: 28px; border-radius: 8px; background: #2ec4b6; flex-shrink: 0; }
        .ploy-logo-text { font-weight: 800; font-size: 21px; letter-spacing: -0.01em; color: #0f2e2a; }
        .ploy-nav { display: flex; gap: 28px; }
        .ploy-nav a { font-size: 15px; color: #3c4a48; font-weight: 500; text-decoration: none; }
        .ploy-nav a:hover { color: #2ec4b6; }
        .ploy-header-actions { margin-left: auto; display: flex; align-items: center; gap: 18px; }
        .ploy-header-login { font-size: 15px; color: #3c4a48; font-weight: 500; text-decoration: none; }
        .ploy-header-cta { font-size: 15px; font-weight: 600; color: #fff; background: #2ec4b6; padding: 10px 20px; border-radius: 8px; text-decoration: none; }
        .ploy-header-cta:hover { background: #28b0a3; }
        .ploy-hamburger { display: none; flex-direction: column; gap: 4px; cursor: pointer; border: none; background: none; padding: 4px; }
        .ploy-hamburger span { width: 22px; height: 2px; background: #3c4a48; border-radius: 2px; display: block; }

        /* Hero */
        .ploy-hero { background: linear-gradient(#f4faf9 0%, #fff 100%); }
        .ploy-hero-inner { max-width: 1240px; margin: 0 auto; padding: 72px 48px 64px; display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 56px; align-items: center; }
        .ploy-badge { display: inline-block; font-size: 13px; font-weight: 600; color: #1aa396; background: #e2f5f1; padding: 6px 12px; border-radius: 20px; letter-spacing: 0.01em; }
        .ploy-hero h1 { margin: 20px 0 18px; font-size: 48px; line-height: 1.18; font-weight: 800; letter-spacing: -0.02em; color: #0f2e2a; }
        .ploy-hero p { margin: 0 0 28px; font-size: 18px; line-height: 1.6; color: #54635f; max-width: 440px; }
        .ploy-search-bar { display: flex; align-items: center; background: #fff; border: 1px solid #dce6e4; border-radius: 12px; padding: 7px 7px 7px 18px; max-width: 480px; box-shadow: 0 4px 16px rgba(15,46,42,.05); }
        .ploy-search-bar span:first-child { color: #9cafac; font-size: 16px; flex: 1; }
        .ploy-search-btn { font-size: 15px; font-weight: 600; color: #fff; background: #2ec4b6; padding: 11px 22px; border-radius: 8px; text-decoration: none; white-space: nowrap; }
        .ploy-search-btn:hover { background: #28b0a3; }
        .ploy-social-proof { margin-top: 22px; font-size: 14px; color: #8a9894; }
        .ploy-social-proof b { color: #1aa396; }
        /* Browser mockup */
        .ploy-hero-visual { position: relative; }
        .ploy-browser { border-radius: 14px; overflow: hidden; box-shadow: 0 24px 64px rgba(15,46,42,0.16), 0 4px 16px rgba(15,46,42,0.08); transform: perspective(1000px) rotateY(-4deg) rotateX(2deg); background: #fff; border: 1px solid #d8e6e3; }
        .ploy-browser-bar { background: #f0f4f3; padding: 11px 16px; display: flex; align-items: center; gap: 10px; border-bottom: 1px solid #e2ece9; }
        .ploy-browser-dots { display: flex; gap: 6px; }
        .ploy-browser-dots span { width: 11px; height: 11px; border-radius: 50%; display: block; }
        .ploy-browser-url { flex: 1; background: #fff; border-radius: 6px; padding: 5px 12px; font-size: 12px; color: #8a9894; border: 1px solid #dce6e4; letter-spacing: 0.01em; }
        .ploy-browser-body { padding: 20px; background: #fafcfb; }
        /* Mockup site inside browser */
        .pmock-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px; }
        .pmock-logo { display: flex; align-items: center; gap: 7px; }
        .pmock-logo-dot { width: 16px; height: 16px; border-radius: 5px; background: #2ec4b6; }
        .pmock-logo-text { width: 32px; height: 8px; border-radius: 4px; background: #0f2e2a; }
        .pmock-nav { display: flex; gap: 10px; }
        .pmock-nav span { width: 28px; height: 7px; border-radius: 3px; background: #d4e4e1; }
        .pmock-btn-sm { width: 52px; height: 24px; border-radius: 6px; background: #2ec4b6; }
        .pmock-hero { background: linear-gradient(135deg, #e8f8f5 0%, #f4fbfa 100%); border-radius: 10px; padding: 22px 20px 20px; margin-bottom: 16px; }
        .pmock-tag { width: 80px; height: 7px; border-radius: 3px; background: #a8ddd8; margin-bottom: 12px; }
        .pmock-h1-a { width: 85%; height: 13px; border-radius: 4px; background: #0f2e2a; margin-bottom: 8px; }
        .pmock-h1-b { width: 65%; height: 13px; border-radius: 4px; background: #0f2e2a; margin-bottom: 14px; }
        .pmock-desc-a { width: 90%; height: 7px; border-radius: 3px; background: #c4d8d5; margin-bottom: 6px; }
        .pmock-desc-b { width: 70%; height: 7px; border-radius: 3px; background: #c4d8d5; margin-bottom: 18px; }
        .pmock-cta { width: 88px; height: 30px; border-radius: 7px; background: #2ec4b6; }
        .pmock-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
        .pmock-card { background: #fff; border: 1px solid #e6eeec; border-radius: 9px; padding: 12px; }
        .pmock-card-icon { width: 24px; height: 24px; border-radius: 6px; background: #e2f5f1; margin-bottom: 10px; }
        .pmock-card-title { width: 60%; height: 7px; border-radius: 3px; background: #1a3530; margin-bottom: 7px; }
        .pmock-card-sub { width: 80%; height: 6px; border-radius: 3px; background: #d4e4e1; }
        /* Floating badge */
        .ploy-browser-badge { position: absolute; bottom: -14px; right: -16px; background: #fff; border: 1px solid #eaf0ef; border-radius: 12px; padding: 10px 14px; display: flex; align-items: center; gap: 10px; box-shadow: 0 8px 24px rgba(15,46,42,0.12); }
        .ploy-badge-icon { width: 32px; height: 32px; border-radius: 8px; background: #e2f5f1; display: flex; align-items: center; justify-content: center; font-size: 16px; }
        .ploy-badge-text-a { width: 72px; height: 8px; border-radius: 3px; background: #152c29; margin-bottom: 5px; }
        .ploy-badge-text-b { width: 52px; height: 6px; border-radius: 3px; background: #c4d8d5; }

        /* Reviews — infinite scroll columns */
        @keyframes ploy-scroll-up { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        .ploy-reviews { border-top: 1px solid #f0f4f3; background: #fbfdfc; padding: 60px 0; overflow: hidden; }
        .ploy-reviews-inner { max-width: 1240px; margin: 0 auto; padding: 0 48px; }
        .ploy-reviews-header { display: flex; align-items: center; gap: 14px; margin-bottom: 36px; }
        .ploy-reviews-header h2 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #0f2e2a; }
        .ploy-rating { font-size: 15px; font-weight: 700; color: #1aa396; }
        .ploy-reviews-count { font-size: 14px; color: #8a9894; }
        .ploy-reviews-cols { display: flex; gap: 20px; max-height: 600px; overflow: hidden;
          mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 18%, black 82%, transparent); }
        .ploy-reviews-col { flex: 1; display: flex; flex-direction: column; gap: 16px; }
        .ploy-reviews-col--2 { display: none; }
        .ploy-reviews-col--3 { display: none; }
        @media (min-width: 768px) { .ploy-reviews-col--2 { display: flex; } }
        @media (min-width: 1024px) { .ploy-reviews-col--3 { display: flex; } }
        .ploy-col-track { display: flex; flex-direction: column; gap: 16px;
          animation: ploy-scroll-up linear infinite; }
        .ploy-col-track--a { animation-duration: 22s; }
        .ploy-col-track--b { animation-duration: 28s; }
        .ploy-col-track--c { animation-duration: 25s; }
        .ploy-col-track:hover { animation-play-state: paused; }
        .ploy-review-card { background: #fff; border: 1px solid #eaf0ef; border-radius: 14px; padding: 22px 24px; flex-shrink: 0; }
        .ploy-stars { color: #2ec4b6; font-size: 14px; letter-spacing: 2px; }
        .ploy-review-card p { margin: 12px 0 16px; font-size: 14px; line-height: 1.65; color: #3c4a48; }
        .ploy-reviewer { display: flex; align-items: center; gap: 10px; }
        .ploy-avatar { width: 32px; height: 32px; border-radius: 50%; background: #e2f5f1; flex-shrink: 0; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 700; color: #1aa396; }
        .ploy-reviewer-name { font-size: 13px; font-weight: 700; color: #152c29; }
        .ploy-reviewer-type { font-size: 11px; color: #9cafac; }

        /* Categories */
        .ploy-categories { padding: 72px 0; }
        .ploy-categories-inner { max-width: 1240px; margin: 0 auto; padding: 0 48px; }
        .ploy-categories h2 { margin: 0 0 6px; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #0f2e2a; }
        .ploy-categories > div > p { margin: 0 0 32px; font-size: 16px; color: #6b7976; }
        .ploy-categories-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .ploy-cat-card { border: 1px solid #eaf0ef; border-radius: 14px; padding: 24px; cursor: pointer; transition: box-shadow .15s; text-decoration: none; display: block; }
        .ploy-cat-card:hover { box-shadow: 0 4px 20px rgba(15,46,42,.1); }
        .ploy-cat-icon { width: 44px; height: 44px; border-radius: 11px; background: #e2f5f1; display: flex; align-items: center; justify-content: center; }
        .ploy-cat-name { margin-top: 16px; font-size: 18px; font-weight: 700; color: #152c29; }
        .ploy-cat-desc { margin-top: 5px; font-size: 14px; color: #7b8784; }

        /* Steps */
        .ploy-steps { background: #f7fbfa; padding: 72px 0; }
        .ploy-steps-inner { max-width: 1240px; margin: 0 auto; padding: 0 48px; }
        .ploy-steps h2 { margin: 0 0 36px; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: #0f2e2a; }
        .ploy-steps-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .ploy-step-num { font: 800 15px ui-monospace, monospace; color: #2ec4b6; }
        .ploy-step-title { margin-top: 12px; font-size: 19px; font-weight: 700; color: #152c29; }
        .ploy-step p { margin: 8px 0 0; font-size: 15px; line-height: 1.6; color: #6b7976; }

        /* Stats */
        .ploy-stats { padding: 60px 0; }
        .ploy-stats-inner { max-width: 1240px; margin: 0 auto; padding: 0 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; text-align: center; }
        .ploy-stat-num { font-size: 40px; font-weight: 800; color: #1aa396; letter-spacing: -0.02em; }
        .ploy-stat-label { margin-top: 6px; font-size: 15px; color: #6b7976; }
        .ploy-stat-mid { border-left: 1px solid #ecf1f0; border-right: 1px solid #ecf1f0; }

        /* CTA */
        .ploy-cta { background: #0f2e2a; padding: 64px 48px; text-align: center; }
        .ploy-cta h2 { margin: 0 0 10px; font-size: 30px; font-weight: 800; color: #fff; letter-spacing: -0.02em; }
        .ploy-cta p { margin: 0 0 26px; font-size: 16px; color: #a7c4be; }
        .ploy-cta-btn { display: inline-block; font-size: 16px; font-weight: 700; color: #0f2e2a; background: #2ec4b6; padding: 15px 32px; border-radius: 10px; text-decoration: none; }
        .ploy-cta-btn:hover { background: #28b0a3; }

        /* Footer */
        .ploy-footer { padding: 36px 48px; display: flex; align-items: center; gap: 14px; border-top: 1px solid #ecf1f0; }
        .ploy-footer-icon { width: 22px; height: 22px; border-radius: 6px; background: #2ec4b6; flex-shrink: 0; }
        .ploy-footer-name { font-weight: 800; color: #0f2e2a; }
        .ploy-footer-copy { margin-left: auto; font-size: 13px; color: #9cafac; }

        /* Responsive */
        @media (max-width: 768px) {
          .ploy-header-inner { padding: 0 20px; }
          .ploy-nav { display: none; }
          .ploy-header-actions { display: none; }
          .ploy-hamburger { display: flex; }

          .ploy-hero-inner { padding: 36px 20px 40px; grid-template-columns: 1fr; gap: 28px; }
          .ploy-hero h1 { font-size: 36px; }
          .ploy-hero p { font-size: 16px; }
          .ploy-hero-visual { display: none; }

          .ploy-reviews-inner { padding: 0 20px; }
          .ploy-reviews { padding: 36px 0; }
          .ploy-reviews-cols { max-height: 480px; }
          .ploy-reviews-header h2 { font-size: 20px; }

          .ploy-categories-inner { padding: 0 20px; }
          .ploy-categories { padding: 36px 0; }
          .ploy-categories-grid { grid-template-columns: 1fr 1fr; gap: 12px; }
          .ploy-cat-card { padding: 18px; }
          .ploy-cat-icon { width: 38px; height: 38px; border-radius: 10px; }
          .ploy-cat-name { font-size: 16px; }

          .ploy-steps-inner { padding: 0 20px; }
          .ploy-steps { padding: 36px 0; }
          .ploy-steps-grid { grid-template-columns: 1fr; gap: 22px; }
          .ploy-steps h2 { font-size: 20px; margin-bottom: 24px; }
          .ploy-step { display: flex; gap: 14px; }
          .ploy-step-num { flex-shrink: 0; font-size: 14px; }
          .ploy-step-title { margin-top: 0; font-size: 17px; }

          .ploy-stats-inner { padding: 20px; display: flex; justify-content: space-between; }
          .ploy-stats { padding: 32px 0; }
          .ploy-stat-num { font-size: 26px; }
          .ploy-stat-label { font-size: 12px; }
          .ploy-stat-mid { border: none; }

          .ploy-cta { padding: 44px 20px; }
          .ploy-cta h2 { font-size: 24px; }
          .ploy-cta-btn { display: block; }

          .ploy-footer { padding: 24px 20px; }
        }
      `}</style>

      <div className="ploy-page">

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="ploy-header">
          <div className="ploy-header-inner">
            <Link to="/" className="ploy-logo">
              <div className="ploy-logo-icon" />
              <span className="ploy-logo-text">PLOY</span>
            </Link>

            <nav className="ploy-nav">
              <NavDropdown label="상품" href="/shop" items={SHOP_ITEMS} />
              <NavDropdown label="전자책" href="/shop?type=EBOOK" items={EBOOK_ITEMS} />
              <Link to="/partners">포트폴리오</Link>
              <a href="#how-it-works">이용 방법</a>
            </nav>

            <div className="ploy-header-actions">
              {isAuthenticated ? (
                <Link to="/client" className="ploy-header-login">대시보드</Link>
              ) : (
                <Link to="/login" className="ploy-header-login">로그인</Link>
              )}
              <Link to={ctaHref} className="ploy-header-cta">의뢰하기</Link>
            </div>

            <button className="ploy-hamburger" aria-label="메뉴">
              <span /><span /><span />
            </button>
          </div>
        </header>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="ploy-hero">
          <div className="ploy-hero-inner">
            <div>
              <span className="ploy-badge">검증된 전문가 매칭 플랫폼</span>
              <h1>첫인상은<br />결과를 바꿉니다.</h1>
              <p>
                PPT · 로고 · 명함 · 상세페이지 · 웹사이트까지,<br />
                목적에 맞는 결과물을 제공합니다.
              </p>
              <form className="ploy-search-bar" onSubmit={handleSearch}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="어떤 결과물이 필요하세요?"
                  style={{ border: 'none', outline: 'none', flex: 1, fontSize: 16, color: '#3c4a48', background: 'transparent' }}
                />
                <button type="submit" className="ploy-search-btn" style={{ border: 'none', cursor: 'pointer' }}>의뢰 시작</button>
              </form>
              <div className="ploy-social-proof">
                이미 <b>2,400+</b> 기업이 PLOY와 함께하고 있습니다
              </div>
            </div>
            <div className="ploy-hero-visual">
              <div className="ploy-browser">
                {/* Browser chrome */}
                <div className="ploy-browser-bar">
                  <div className="ploy-browser-dots">
                    <span style={{ background: '#ff5f57' }} />
                    <span style={{ background: '#ffbd2e' }} />
                    <span style={{ background: '#28c840' }} />
                  </div>
                  <div className="ploy-browser-url">ploy.kr · 웹사이트 결과물 미리보기</div>
                </div>

                {/* Mockup content */}
                <div className="ploy-browser-body">
                  {/* Fake site header */}
                  <div className="pmock-header">
                    <div className="pmock-logo">
                      <div className="pmock-logo-dot" />
                      <div className="pmock-logo-text" />
                    </div>
                    <div className="pmock-nav">
                      <span /><span /><span />
                    </div>
                    <div className="pmock-btn-sm" />
                  </div>

                  {/* Fake hero section */}
                  <div className="pmock-hero">
                    <div className="pmock-tag" />
                    <div className="pmock-h1-a" />
                    <div className="pmock-h1-b" />
                    <div className="pmock-desc-a" />
                    <div className="pmock-desc-b" />
                    <div className="pmock-cta" />
                  </div>

                  {/* Fake cards */}
                  <div className="pmock-cards">
                    {['#e2f5f1', '#fef3c7', '#ede9fe'].map((bg, i) => (
                      <div key={i} className="pmock-card">
                        <div className="pmock-card-icon" style={{ background: bg }} />
                        <div className="pmock-card-title" />
                        <div className="pmock-card-sub" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating "완성" badge */}
              <div className="ploy-browser-badge">
                <div className="ploy-badge-icon">✅</div>
                <div>
                  <div className="ploy-badge-text-a" />
                  <div className="ploy-badge-text-b" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1aa396', marginLeft: 4 }}>완성</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Reviews — infinite scroll columns ─────────────────── */}
        <section className="ploy-reviews">
          <div className="ploy-reviews-inner">
            <div className="ploy-reviews-header">
              <h2>고객 리뷰</h2>
              <span className="ploy-rating">★ 4.9</span>
              <span className="ploy-reviews-count">· 12,800+ 후기</span>
            </div>
            <div className="ploy-reviews-cols">
              {[COL_A, COL_B, COL_C].map((col, ci) => (
                <div key={ci} className={`ploy-reviews-col${ci === 1 ? ' ploy-reviews-col--2' : ci === 2 ? ' ploy-reviews-col--3' : ''}`}>
                  {/* Duplicate track for seamless loop */}
                  <div className={`ploy-col-track ploy-col-track--${['a','b','c'][ci]}`}>
                    {[...col, ...col].map((r, i) => (
                      <div key={i} className="ploy-review-card">
                        <div className="ploy-stars">★★★★★</div>
                        <p>{r.text}</p>
                        <div className="ploy-reviewer">
                          <div className="ploy-avatar">{r.name.charAt(0)}</div>
                          <div>
                            <div className="ploy-reviewer-name">{r.name}</div>
                            <div className="ploy-reviewer-type">{r.type}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Categories ─────────────────────────────────────────── */}
        <section className="ploy-categories">
          <div className="ploy-categories-inner">
            <h2>필요한 결과물을 골라보세요</h2>
            <div><p>자주 의뢰되는 카테고리</p></div>
            <div className="ploy-categories-grid">
              {[
                { name: '명함', desc: '브랜드의 첫 악수', type: 'BUSINESS_CARD', icon: <div style={{ width: 18, height: 14, borderRadius: 3, background: '#2ec4b6' }} /> },
                { name: '전자책', desc: '읽고 싶게 만드는 편집', type: 'EBOOK', icon: <div style={{ width: 14, height: 18, borderRadius: 3, background: '#2ec4b6' }} /> },
                { name: 'PPT · 제안서', desc: '설득되는 한 장', type: 'PRESENTATION', icon: <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#2ec4b6' }} /> },
                { name: '로고 · 브랜딩', desc: '기억되는 상징', type: 'LOGO', icon: <div style={{ width: 18, height: 18, borderRadius: 5, background: '#2ec4b6', transform: 'rotate(45deg)' }} /> },
                { name: '상세페이지', desc: '전환을 만드는 흐름', type: 'DETAIL_PAGE', icon: <div style={{ width: 20, height: 12, borderRadius: 3, background: '#2ec4b6' }} /> },
                { name: '웹 · 앱', desc: '작동하는 경험', type: 'WEBSITE', icon: <div style={{ width: 18, height: 18, borderRadius: 4, border: '3px solid #2ec4b6' }} /> },
              ].map((c, i) => (
                <Link
                  key={i}
                  to={c.type === 'EBOOK' ? `/shop?type=EBOOK` : `/client/request?type=${c.type}`}
                  className="ploy-cat-card"
                >
                  <div className="ploy-cat-icon">{c.icon}</div>
                  <div className="ploy-cat-name">{c.name}</div>
                  <div className="ploy-cat-desc">{c.desc}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── How it works ───────────────────────────────────────── */}
        <section className="ploy-steps" id="how-it-works">
          <div className="ploy-steps-inner">
            <h2>의뢰는 3단계면 충분합니다</h2>
            <div className="ploy-steps-grid">
              {[
                { num: '01', title: '의뢰 등록', desc: '필요한 작업과 예산, 일정을 남겨주세요.' },
                { num: '02', title: '전문가 매칭', desc: '검증된 전문가가 직접 제안을 보냅니다.' },
                { num: '03', title: '결과물 수령', desc: '만족할 때까지 함께 완성합니다.' },
              ].map((s, i) => (
                <div key={i} className="ploy-step">
                  <div>
                    <div className="ploy-step-num">{s.num}</div>
                    <div className="ploy-step-title">{s.title}</div>
                    <p>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Stats ──────────────────────────────────────────────── */}
        <section className="ploy-stats">
          <div className="ploy-stats-inner">
            <div>
              <div className="ploy-stat-num">38,000+</div>
              <div className="ploy-stat-label">누적 프로젝트</div>
            </div>
            <div className="ploy-stat-mid">
              <div className="ploy-stat-num">9,200+</div>
              <div className="ploy-stat-label">등록 전문가</div>
            </div>
            <div>
              <div className="ploy-stat-num">96%</div>
              <div className="ploy-stat-label">재의뢰율</div>
            </div>
          </div>
        </section>

        {/* ── CTA ────────────────────────────────────────────────── */}
        <section className="ploy-cta">
          <h2>지금, 당신의 첫인상을 바꿔보세요</h2>
          <p>의뢰 등록은 무료입니다.</p>
          <Link to={ctaHref} className="ploy-cta-btn">무료로 의뢰 시작하기</Link>
        </section>

        {/* ── Footer ─────────────────────────────────────────────── */}
        <footer className="ploy-footer">
          <div className="ploy-footer-icon" />
          <span className="ploy-footer-name">PLOY</span>
          <span className="ploy-footer-copy">© 2026 PLOY. 모든 결과물의 첫인상.</span>
        </footer>

      </div>
    </>
  )
}
