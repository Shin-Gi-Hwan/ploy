export interface NavItem {
  label: string
  path: string
  icon: string   // icon key — resolved in Sidebar
  exact?: boolean
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: '운영',
    items: [
      { label: '대시보드',    path: '/console',             icon: 'dashboard', exact: true },
      { label: '프로젝트',    path: '/console/projects',    icon: 'projects' },
      { label: '문의',        path: '/console/inquiries',   icon: 'inquiries' },
    ],
  },
  {
    label: '사용자',
    items: [
      { label: '회원 관리',   path: '/console/users',       icon: 'users' },
      { label: '파트너 관리', path: '/console/partners',    icon: 'partners' },
    ],
  },
  {
    label: '상품 / 주문',
    items: [
      { label: '상품 관리',   path: '/console/products',    icon: 'products' },
      { label: '주문 관리',   path: '/console/orders',      icon: 'orders' },
    ],
  },
  {
    label: '콘텐츠',
    items: [
      { label: '리뷰 / 포트폴리오', path: '/console/reviews', icon: 'reviews' },
      { label: '채팅 모니터',      path: '/console/chat',     icon: 'chat' },
    ],
  },
  {
    label: '관리',
    items: [
      { label: '알림',          path: '/console/notifications',  icon: 'notifications' },
      { label: '로그인 이력',   path: '/console/login-audits',   icon: 'login-history' },
      { label: '감사 로그',     path: '/console/audit',          icon: 'audit' },
      { label: '설정',          path: '/console/settings',       icon: 'settings' },
    ],
  },
]

export const ROUTE_LABELS: Record<string, string> = {
  '/console':              '대시보드',
  '/console/projects':     '프로젝트 관리',
  '/console/inquiries':    '문의 관리',
  '/console/users':        '회원 관리',
  '/console/partners':     '파트너 관리',
  '/console/products':     '상품 관리',
  '/console/orders':       '주문 관리',
  '/console/reviews':      '리뷰 / 포트폴리오',
  '/console/chat':         '채팅 모니터',
  '/console/notifications': '알림 관리',
  '/console/login-audits':  '로그인 이력',
  '/console/audit':         '감사 로그',
  '/console/settings':      '설정',
}
