// ── Reviews ────────────────────────────────────────────────────────────────────

export interface Review {
  id: number
  author: string
  role: string
  service: string
  text: string
  rating: 5 | 4 | 3
  isPlaceholder?: boolean
  avatarUrl?: string
  date?: string
}

// MIN_DISPLAY: minimum cards needed for a smooth carousel loop.
// If real reviews < MIN_DISPLAY, fill remaining with placeholder reviews.
export const MIN_DISPLAY_REVIEWS = 8

export const PLACEHOLDER_REVIEWS: Review[] = [
  {
    id: 101,
    author: '김민지',
    role: '요가 스튜디오 대표',
    service: '명함 제작',
    text: '핀터레스트 레퍼런스 몇 장 보내드렸는데 정말 마음에 쏙 드는 명함이 나왔어요. 3일 만에 완성됐고 직접 나눠줄 때마다 반응이 좋습니다.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 102,
    author: '박준혁',
    role: '스타트업 공동창업자',
    service: 'PPT 제작',
    text: '투자자 피치덱이 너무 허접해서 맡겼는데, 새 덱으로 발표하고 후속 미팅 3건이 잡혔습니다. 확실히 첫인상이 다르더라고요.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 103,
    author: '이수아',
    role: '프리랜서 사진작가',
    service: '웹사이트 제작',
    text: '깔끔하고 빠르게, 딱 제 스타일대로 만들어주셨어요. 앞뒤로 길게 조율할 것도 없이 한 번에 나와서 놀랐습니다.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 104,
    author: '정다은',
    role: 'UX 컨설턴트',
    service: 'PPT 제작',
    text: '메모 수준으로 정리한 내용을 컨퍼런스에서 발표해도 부끄럽지 않은 PPT로 만들어주셨습니다. 강력 추천해요.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 105,
    author: '최현우',
    role: '부동산 에이전트',
    service: '명함 제작',
    text: '명함 어디서 만들었냐는 질문을 정말 많이 받아요. 퀄리티 차이가 확실히 느껴지나 봐요.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 106,
    author: '한소연',
    role: '라이프 코치',
    service: '웹사이트 제작',
    text: '2년 동안 미루다가 맡겼는데 일주일 만에 상상 이상으로 나왔어요. 진작 맡길걸 싶었습니다.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 107,
    author: '윤재원',
    role: '프로덕트 매니저',
    service: 'PPT 제작',
    text: '내부 제안서에 썼는데 첫 번째 시도에 승인났어요. 비주얼이 설득력을 확실히 높여주더라고요.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 108,
    author: '송아영',
    role: '패션 디자이너',
    service: '명함 제작',
    text: '브랜드 감성을 완벽하게 담아줬어요. 미니멀하고 럭셔리한 느낌, 받는 분들마다 기억하시더라고요.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 109,
    author: '임성준',
    role: 'SaaS 창업자',
    service: 'PPT 제작',
    text: '전에 쓰던 투자자 덱은 아마추어 같았는데, 이번 버전으로 프리시드 클로징했습니다. 충분히 값어치 합니다.',
    rating: 5,
    isPlaceholder: true,
  },
  {
    id: 110,
    author: '강나연',
    role: '인테리어 디자이너',
    service: '웹사이트 제작',
    text: '포트폴리오 사이트 만든 후 문의가 눈에 띄게 늘었어요. 깔끔한 디자인이 고객 신뢰감을 높여주는 것 같아요.',
    rating: 5,
    isPlaceholder: true,
  },
]

/**
 * Merge real reviews with placeholder reviews.
 * Real reviews fill first; placeholders fill remaining slots up to MIN_DISPLAY_REVIEWS.
 * When real reviews reach MIN_DISPLAY_REVIEWS, placeholders disappear entirely.
 */
export function buildHybridReviews(realReviews: Review[]): Review[] {
  if (realReviews.length >= MIN_DISPLAY_REVIEWS) return realReviews
  const needed = MIN_DISPLAY_REVIEWS - realReviews.length
  return [...realReviews, ...PLACEHOLDER_REVIEWS.slice(0, needed)]
}

// ── Portfolio ──────────────────────────────────────────────────────────────────

export type PortfolioCategory = 'PPT' | 'LOGO' | 'BUSINESS_CARD' | 'WEBSITE' | 'DETAIL_PAGE'

export interface PortfolioMockItem {
  id: number
  title: string
  category: PortfolioCategory
  description: string
  thumbnail?: string   // URL — leave undefined to show gradient placeholder
  partnerId?: number
  partnerName?: string
  createdAt: string
}

export const MOCK_PORTFOLIO: PortfolioMockItem[] = [
  {
    id: 1,
    title: '테크 스타트업 투자자 피치덱',
    category: 'PPT',
    description: '시리즈 A 투자 유치를 위한 20슬라이드 피치덱. 브랜드 아이덴티티를 유지하면서 데이터 시각화를 강화했습니다.',
    createdAt: '2024-11',
  },
  {
    id: 2,
    title: '카페 브랜드 로고 디자인',
    category: 'LOGO',
    description: '독립 카페를 위한 미니멀 로고. 따뜻하고 현대적인 감성으로 브랜드 아이덴티티를 완성했습니다.',
    createdAt: '2024-10',
  },
  {
    id: 3,
    title: '부동산 에이전시 명함',
    category: 'BUSINESS_CARD',
    description: '고급 부동산 에이전시를 위한 프리미엄 명함. 엠보싱 효과와 흑백 대비로 신뢰감을 높였습니다.',
    createdAt: '2024-11',
  },
  {
    id: 4,
    title: '헬스 코칭 랜딩 페이지',
    category: 'WEBSITE',
    description: '퍼스널 트레이너를 위한 모바일 최적화 랜딩 페이지. 전환율을 높이는 구조와 깔끔한 비주얼.',
    createdAt: '2024-09',
  },
  {
    id: 5,
    title: '스킨케어 제품 상세 페이지',
    category: 'DETAIL_PAGE',
    description: '프리미엄 스킨케어 브랜드의 신제품 상세 페이지. 성분과 효과를 감각적으로 전달합니다.',
    createdAt: '2024-10',
  },
  {
    id: 6,
    title: '핀테크 서비스 회사 소개서',
    category: 'PPT',
    description: '국내 핀테크 스타트업의 파트너사 대상 회사 소개 PPT. 신뢰감 있는 블루 컬러 팔레트 적용.',
    createdAt: '2024-12',
  },
  {
    id: 7,
    title: '푸드 브랜드 로고 + BI',
    category: 'LOGO',
    description: '수제 쿠키 브랜드의 로고와 브랜드 아이덴티티 패키지. 따뜻하고 친근한 핸드크래프트 감성.',
    createdAt: '2024-08',
  },
  {
    id: 8,
    title: '요가 스튜디오 포트폴리오 사이트',
    category: 'WEBSITE',
    description: '요가 강사를 위한 5페이지 포트폴리오 웹사이트. 차분하고 고요한 분위기의 미니멀 레이아웃.',
    createdAt: '2024-11',
  },
  {
    id: 9,
    title: '법률 사무소 명함',
    category: 'BUSINESS_CARD',
    description: '로펌을 위한 클래식하고 전문적인 명함 디자인. 신뢰와 권위를 담은 타이포그래피 중심 레이아웃.',
    createdAt: '2024-07',
  },
  {
    id: 10,
    title: '패션 브랜드 상세 페이지',
    category: 'DETAIL_PAGE',
    description: '온라인 패션 브랜드의 시즌 신상품 상세 페이지. 감각적인 레이아웃으로 구매 전환율을 높였습니다.',
    createdAt: '2024-09',
  },
]
