const SERVICES = [
  { href: '/ebook',        icon: '📖', title: '전자책',        desc: '실무에 바로 적용 가능한 전자책을 만나보세요.',      cta: '전자책 보러가기 →' },
  { href: '/ppt',          icon: '📊', title: 'PPT 제작',      desc: '전문 디자이너가 만드는 고퀄리티 PPT 디자인',       cta: '서비스 자세히 보기 →' },
  { href: '/logo',         icon: '✒️', title: '로고 제작',     desc: '브랜드의 가치를 높이는 맞춤형 로고 디자인',        cta: '서비스 자세히 보기 →' },
  { href: '/businesscard', icon: '💳', title: '명함 제작',     desc: '브랜드 이미지를 담은 고급 명함 디자인',            cta: '서비스 자세히 보기 →' },
  { href: '/detailpage',   icon: '🛍️', title: '상세페이지 제작', desc: '깔끔하고 세련된 맞춤 상세페이지 제작',          cta: '서비스 자세히 보기 →' },
]

const PROCESS = [
  { n: '01', title: '상담 및 요청 확인', desc: '원하시는 작업 방향, 목적, 참고자료를 확인합니다.' },
  { n: '02', title: '견적 안내',         desc: '작업 범위와 일정에 맞춰 합리적인 견적을 안내드립니다.' },
  { n: '03', title: '디자인 작업',       desc: 'PPT, 로고, 명함, 상세페이지 등 요청 내용에 맞게 제작합니다.' },
  { n: '04', title: '수정 반영',         desc: '피드백을 바탕으로 완성도를 높이는 수정 작업을 진행합니다.' },
  { n: '05', title: '최종 전달',         desc: '완성 파일을 전달드리고 필요한 안내까지 함께 제공합니다.' },
]

const REVIEWS = [
  { service: '전자책',      text: '애드센스 승인 과정을 체계적으로 정리해주셔서 시행착오를 줄일 수 있었습니다.',         author: '신○○ 고객님' },
  { service: 'PPT 제작',   text: '급하게 필요했던 발표자료를 빠르게 제작해주셔서 만족했습니다.',                        author: '박○○ 고객님' },
  { service: '로고 제작',   text: '브랜드 컨셉을 잘 이해해주셔서 원하는 느낌의 로고가 완성되었습니다.',                 author: '이○○ 고객님' },
  { service: '명함 제작',   text: '깔끔하고 고급스러운 디자인 덕분에 첫인상이 좋아졌습니다.',                           author: '최○○ 고객님' },
  { service: '전자책',      text: '처음 부업을 시작하는 입장에서 어떤 방향으로 가야 할지 큰 도움이 되었습니다.',         author: '홍○○ 고객님' },
  { service: 'PPT 제작',   text: '디자인뿐 아니라 내용 구성까지 신경 써주셔서 만족했습니다.',                           author: '김○○ 고객님' },
  { service: '로고 제작',   text: '브랜드 방향성을 빠르게 이해하고 여러 시안을 제안해주셨습니다.',                       author: '정○○ 고객님' },
  { service: '명함 제작',   text: '고급스럽고 세련된 느낌이 잘 표현되어 만족합니다.',                                   author: '조○○ 고객님' },
  { service: '전자책',      text: '실제 경험 기반으로 작성된 내용이라 바로 적용하기 좋았습니다.',                        author: '유○○ 고객님' },
  { service: 'PPT 제작',   text: '기업 발표용으로 제작했는데 기대 이상으로 깔끔하게 나왔습니다.',                        author: '윤○○ 고객님' },
  { service: '로고 제작',   text: '처음 생각했던 것보다 훨씬 세련된 방향으로 완성되어 만족했습니다.',                    author: '강○○ 고객님' },
  { service: '명함 제작',   text: '브랜드 이미지와 잘 맞는 명함이 완성되어 마음에 들었습니다.',                         author: '한○○ 고객님' },
  { service: '전자책',      text: '불필요한 내용 없이 핵심만 정리되어 있어 끝까지 읽기 편했습니다.',                     author: '백○○ 고객님' },
  { service: 'PPT 제작',   text: '짧은 일정에도 높은 퀄리티로 작업해주셔서 감사했습니다.',                              author: '강○○ 고객님' },
  { service: '로고 제작',   text: '수정 요청도 빠르게 반영해주셔서 편하게 진행할 수 있었습니다.',                        author: '임○○ 고객님' },
  { service: '전자책',      text: '초보자도 이해하기 쉽게 정리되어 있어 바로 따라 하기 좋았습니다.',                     author: '서○○ 고객님' },
  { service: 'PPT 제작',   text: '내용 정리가 어려웠는데 구조부터 디자인까지 깔끔하게 잡아주셨습니다.',                  author: '한○○ 고객님' },
  { service: '전자책',      text: '필요한 내용만 핵심적으로 정리되어 있어 시간을 많이 절약했습니다.',                     author: '박○○ 고객님' },
  { service: '명함 제작',   text: '종이 선택부터 디자인까지 꼼꼼하게 안내받아 만족스러웠습니다.',                        author: '문○○ 고객님' },
  { service: '전자책',      text: '막연했던 블로그 수익화 방향을 잡는 데 많은 도움이 되었습니다.',                        author: '오○○ 고객님' },
]

const TRUST = [
  { icon: '⚡', title: '빠른 작업',      desc: '일정에 맞춘 신속한 제작과 피드백 대응' },
  { icon: '🎯', title: '맞춤형 디자인',  desc: '업종과 목적에 맞춘 1:1 맞춤 제작' },
  { icon: '💬', title: '수정 반영',      desc: '피드백을 반영하여 완성도를 높입니다' },
  { icon: '📚', title: '전자책 + 디자인', desc: '배움과 디자인을 함께 제공하는 플랫폼' },
]

const FAQS = [
  { q: '작업 기간은 얼마나 걸리나요?',          a: '작업 종류와 분량에 따라 다르며 상담 후 정확히 안내드립니다.' },
  { q: '수정은 가능한가요?',                    a: '가능합니다. 작업 범위에 따라 수정 횟수를 안내드립니다.' },
  { q: 'PPT 원본 파일도 제공되나요?',           a: '네. 최종 작업 완료 후 원본 파일을 함께 전달드립니다.' },
  { q: '로고 제작 시 저작권은 어떻게 되나요?',  a: '최종 확정된 로고는 고객이 자유롭게 사용할 수 있습니다.' },
  { q: '전자책은 어떻게 받을 수 있나요?',       a: '결제 후 즉시 다운로드 또는 별도 안내를 통해 제공됩니다.' },
]

// Reviews are duplicated for seamless infinite scroll
const ALL_REVIEWS = [...REVIEWS, ...REVIEWS]

export default function Portfolio() {
  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── Hero ── */}
      <section id="ploy-hero-section-wrap">
        <div id="ploy-hero-section-bg">

          <div className="ploy-hero-section-dots" />

          <div className="ploy-hero-side-image ploy-hero-left-image">
            <img src="https://cdn.imweb.me/thumbnail/20260610/8763c95d3b1bf.png" alt="전자책" />
          </div>

          <div className="ploy-hero-section-inner">
            <h1 className="ploy-hero-section-title">
              디자인이 필요한 순간,<br />
              <span>PLOY</span>
            </h1>
            <p className="ploy-hero-section-desc">
              전자책 · PPT · 로고 · 상세페이지 전문 제작<br />
              아이디어를 판매 가능한 결과물로 만들어드립니다.
            </p>
            <div className="ploy-hero-section-buttons">
              <a href="#service" className="ploy-hero-section-btn-primary">
                서비스 둘러보기 <i className="fa-solid fa-arrow-right" />
              </a>
              <a href="#ebook" className="ploy-hero-section-btn-secondary">
                전자책 보러가기
              </a>
            </div>
          </div>

          <div className="ploy-hero-side-image ploy-hero-right-image">
            <img src="https://cdn.imweb.me/thumbnail/20260611/fc39c2f480abc.png" alt="PPT 포트폴리오" />
          </div>

        </div>
      </section>

      {/* ── Services ── */}
      <section id="ploy-services-section-wrap">
        <div id="ploy-services-section-inner">
          <div className="ploy-services-section-header">
            <p className="ploy-services-section-label">OUR SERVICES</p>
            <h2 className="ploy-services-section-title">PLOY가 제공하는 서비스</h2>
            <p className="ploy-services-section-desc">
              전자책부터 디자인 제작까지, 필요한 모든 서비스를 한 곳에서.
            </p>
          </div>
          <div id="service" className="ploy-services-section-grid">
            {SERVICES.map((s) => (
              <a key={s.href} href={s.href} id={s.href === '/ebook' ? 'ebook' : undefined} className="ploy-services-section-card">
                <div className="ploy-services-section-icon"><span>{s.icon}</span></div>
                <strong>{s.title}</strong>
                <p>{s.desc}</p>
                <em>{s.cta}</em>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section id="ploy-process-section-wrap">
        <div className="ploy-process-section-inner">
          <div className="ploy-process-section-header">
            <p className="ploy-process-section-label">WORK PROCESS</p>
            <h2 className="ploy-process-section-title">작업은 이렇게 진행됩니다</h2>
            <p className="ploy-process-section-desc">
              문의부터 최종 전달까지, 처음 맡기시는 분도 쉽게 진행할 수 있습니다.
            </p>
          </div>
          <div className="ploy-process-section-grid">
            {PROCESS.map((p) => (
              <div key={p.n} className="ploy-process-section-card">
                <span>{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Reviews ── */}
      <section id="ploy-review-section">
        <div className="ploy-review-inner">
          <div className="ploy-review-header">
            <p className="ploy-review-label">CUSTOMER REVIEW</p>
            <h2 className="ploy-review-title">작업을 맡겨주신 분들의 후기</h2>
            <p className="ploy-review-desc">
              전자책부터 디자인 제작까지, PLOY와 함께한 고객들의 리뷰입니다.
            </p>
          </div>
          <div className="ploy-review-slider">
            <div className="ploy-review-track">
              {ALL_REVIEWS.map((r, i) => (
                <div key={i} className="ploy-review-card">
                  <div className="stars">★★★★★</div>
                  <strong>{r.service}</strong>
                  <p>{r.text}</p>
                  <span>{r.author}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust / FAQ / CTA ── */}
      <section id="ploy-trust-section">
        <div className="ploy-trust-inner">

          <div className="ploy-trust-header">
            <p className="ploy-trust-label">WHY PLOY</p>
            <h2 className="ploy-trust-title">왜 PLOY를 선택해야 할까요?</h2>
            <p className="ploy-trust-desc">
              단순히 디자인만 만드는 것이 아니라,
              실제 활용 가능한 결과물을 만드는 것을 목표로 합니다.
            </p>
          </div>

          <div className="ploy-trust-grid">
            {TRUST.map((t) => (
              <div key={t.title} className="ploy-trust-card">
                <div className="ploy-trust-icon">{t.icon}</div>
                <h3>{t.title}</h3>
                <p>{t.desc}</p>
              </div>
            ))}
          </div>

          <div className="ploy-faq-wrap">
            <div className="ploy-trust-header">
              <p className="ploy-trust-label">FAQ</p>
              <h2 className="ploy-trust-title">자주 묻는 질문</h2>
            </div>
            <div className="ploy-faq-list">
              {FAQS.map((f) => (
                <details key={f.q}>
                  <summary>{f.q}</summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="ploy-cta-box">
            <p className="ploy-trust-label">START NOW</p>
            <h2>아이디어를 결과물로 만들어보세요</h2>
            <p>
              전자책 · PPT · 로고 · 명함 · 상세페이지 제작<br />
              지금 문의하고 작업을 시작해보세요.
            </p>
            <a href="/inquiry">문의하기 →</a>
          </div>

        </div>
      </section>

    </div>
  )
}
