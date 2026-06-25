import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const ctaHref = isAuthenticated ? '/client/request' : '/login'

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
        .ploy-hero-visual { aspect-ratio: 4/3; border-radius: 16px; background: repeating-linear-gradient(135deg, #e9f2f0 0px, #e9f2f0 13px, #f6fbfa 13px, #f6fbfa 26px); display: flex; align-items: center; justify-content: center; color: #9cafac; font: 500 13px ui-monospace, monospace; letter-spacing: 0.04em; border: 1px solid #e6eeec; }

        /* Reviews */
        .ploy-reviews { border-top: 1px solid #f0f4f3; background: #fbfdfc; padding: 60px 0; }
        .ploy-reviews-inner { max-width: 1240px; margin: 0 auto; padding: 0 48px; }
        .ploy-reviews-header { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; }
        .ploy-reviews-header h2 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.02em; color: #0f2e2a; }
        .ploy-rating { font-size: 15px; font-weight: 700; color: #1aa396; }
        .ploy-reviews-count { font-size: 14px; color: #8a9894; }
        .ploy-reviews-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .ploy-review-card { background: #fff; border: 1px solid #eaf0ef; border-radius: 14px; padding: 24px; }
        .ploy-stars { color: #2ec4b6; font-size: 15px; letter-spacing: 2px; }
        .ploy-review-card p { margin: 14px 0 18px; font-size: 15px; line-height: 1.6; color: #3c4a48; }
        .ploy-reviewer { display: flex; align-items: center; gap: 10px; }
        .ploy-avatar { width: 34px; height: 34px; border-radius: 50%; background: #e2f5f1; flex-shrink: 0; }
        .ploy-reviewer-name { font-size: 14px; font-weight: 700; color: #152c29; }
        .ploy-reviewer-type { font-size: 12px; color: #9cafac; }

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
          .ploy-reviews-grid { grid-template-columns: 1fr; }
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
              <Link to="/shop">카테고리</Link>
              <Link to="/partners">포트폴리오</Link>
              <a href="#how-it-works">이용 방법</a>
              <a href="#pricing">요금</a>
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
              <div className="ploy-search-bar">
                <span>어떤 결과물이 필요하세요?</span>
                <Link to={ctaHref} className="ploy-search-btn">의뢰 시작</Link>
              </div>
              <div className="ploy-social-proof">
                이미 <b>2,400+</b> 기업이 PLOY와 함께하고 있습니다
              </div>
            </div>
            <div className="ploy-hero-visual">[ 히어로 비주얼 / 결과물 목업 ]</div>
          </div>
        </section>

        {/* ── Reviews ────────────────────────────────────────────── */}
        <section className="ploy-reviews">
          <div className="ploy-reviews-inner">
            <div className="ploy-reviews-header">
              <h2>고객 리뷰</h2>
              <span className="ploy-rating">★ 4.9</span>
              <span className="ploy-reviews-count">· 12,800+ 후기</span>
            </div>
            <div className="ploy-reviews-grid">
              {[
                { text: '제안서 하나 바꿨을 뿐인데 미팅 성사율이 달라졌어요. 첫인상이 결과를 바꾼다는 말, 진짜였습니다.', name: '김OO 대표', type: 'PPT · 제안서 의뢰' },
                { text: '상세페이지를 새로 만들고 구매 전환율이 눈에 띄게 올랐습니다. 흐름 설계까지 챙겨주셔서 만족해요.', name: '이OO 마케터', type: '상세페이지 의뢰' },
                { text: '로고부터 명함까지 톤을 맞춰 받았어요. 브랜드 첫인상이 확실히 정돈된 느낌이라 재의뢰했습니다.', name: '박OO 실장', type: '로고 · 브랜딩 의뢰' },
              ].map((r, i) => (
                <div key={i} className="ploy-review-card">
                  <div className="ploy-stars">★★★★★</div>
                  <p>{r.text}</p>
                  <div className="ploy-reviewer">
                    <div className="ploy-avatar" />
                    <div>
                      <div className="ploy-reviewer-name">{r.name}</div>
                      <div className="ploy-reviewer-type">{r.type}</div>
                    </div>
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
                { name: '명함', desc: '브랜드의 첫 악수', icon: <div style={{ width: 18, height: 14, borderRadius: 3, background: '#2ec4b6' }} /> },
                { name: '전자책', desc: '읽고 싶게 만드는 편집', icon: <div style={{ width: 14, height: 18, borderRadius: 3, background: '#2ec4b6' }} /> },
                { name: 'PPT · 제안서', desc: '설득되는 한 장', icon: <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#2ec4b6' }} /> },
                { name: '로고 · 브랜딩', desc: '기억되는 상징', icon: <div style={{ width: 18, height: 18, borderRadius: 5, background: '#2ec4b6', transform: 'rotate(45deg)' }} /> },
                { name: '상세페이지', desc: '전환을 만드는 흐름', icon: <div style={{ width: 20, height: 12, borderRadius: 3, background: '#2ec4b6' }} /> },
                { name: '웹 · 앱', desc: '작동하는 경험', icon: <div style={{ width: 18, height: 18, borderRadius: 4, border: '3px solid #2ec4b6' }} /> },
              ].map((c, i) => (
                <Link key={i} to={ctaHref} className="ploy-cat-card">
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
