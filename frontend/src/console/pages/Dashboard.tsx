import { Link } from 'react-router-dom'
import {
  IcProjects, IcInquiries, IcUsers, IcOrders,
  IcNotifications, IcPartners, IcReviews, IcAudit,
} from '../components/layout/Icons'

interface StatCardProps {
  label: string
  value: string
  meta?: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
}

function StatCard({ label, value, meta, icon, iconBg, iconColor }: StatCardProps) {
  return (
    <div className="cs-stat-card">
      <div className="cs-stat-top">
        <span className="cs-stat-label">{label}</span>
        <div className="cs-stat-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>
      <div className="cs-stat-value">{value}</div>
      {meta && <div className="cs-stat-meta">{meta}</div>}
    </div>
  )
}

const PLACEHOLDER_ACTIVITY = [
  { text: '새 문의가 접수되었습니다', time: '방금 전', dot: '#3DD9B3' },
  { text: '프로젝트 #42 상태가 변경되었습니다', time: '5분 전', dot: '#60A5FA' },
  { text: '파트너 신청이 1건 대기 중입니다', time: '12분 전', dot: '#F59E0B' },
  { text: '새 회원이 가입했습니다', time: '31분 전', dot: '#3DD9B3' },
  { text: '리뷰 신고가 1건 접수되었습니다', time: '1시간 전', dot: '#F43F5E' },
]

const QUICK_ACTIONS = [
  { label: '문의 관리',       sub: '대기 중인 문의를 처리하세요',  path: '/console/inquiries',  icon: <IcInquiries size={16} /> },
  { label: '파트너 승인',     sub: '신청서를 검토하세요',           path: '/console/partners',   icon: <IcPartners size={16} /> },
  { label: '프로젝트 현황',   sub: '진행 중인 프로젝트를 확인하세요', path: '/console/projects',   icon: <IcProjects size={16} /> },
  { label: '알림 발송',       sub: '공지 또는 알림을 보내세요',     path: '/console/notifications', icon: <IcNotifications size={16} /> },
]

export default function Dashboard() {
  return (
    <div>
      {/* Header */}
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">대시보드</h1>
          <p className="cs-page-subtitle">Ploy 운영 현황을 한눈에 확인하세요.</p>
        </div>
        <span className="cs-badge cs-badge-mint" style={{ fontSize: 12 }}>
          Phase 2에서 실시간 데이터 연동 예정
        </span>
      </div>

      {/* Stat Cards */}
      <div className="cs-stat-grid">
        <StatCard
          label="오늘 주문"
          value="—"
          meta="API 연동 후 표시"
          icon={<IcOrders size={16} />}
          iconBg="rgba(61,217,179,0.12)"
          iconColor="#3DD9B3"
        />
        <StatCard
          label="오늘 문의"
          value="—"
          meta="API 연동 후 표시"
          icon={<IcInquiries size={16} />}
          iconBg="rgba(59,130,246,0.1)"
          iconColor="#3B82F6"
        />
        <StatCard
          label="진행 중 프로젝트"
          value="—"
          meta="API 연동 후 표시"
          icon={<IcProjects size={16} />}
          iconBg="rgba(139,92,246,0.1)"
          iconColor="#8B5CF6"
        />
        <StatCard
          label="승인 대기"
          value="—"
          meta="파트너 신청 포함"
          icon={<IcPartners size={16} />}
          iconBg="rgba(245,158,11,0.1)"
          iconColor="#F59E0B"
        />
      </div>

      {/* Second row */}
      <div className="cs-stat-grid" style={{ marginBottom: 24 }}>
        <StatCard
          label="전체 회원"
          value="—"
          meta="API 연동 후 표시"
          icon={<IcUsers size={16} />}
          iconBg="rgba(16,185,129,0.1)"
          iconColor="#10B981"
        />
        <StatCard
          label="이번 달 매출"
          value="—"
          meta="API 연동 후 표시"
          icon={<IcOrders size={16} />}
          iconBg="rgba(244,63,94,0.1)"
          iconColor="#F43F5E"
        />
        <StatCard
          label="리뷰 수"
          value="—"
          meta="API 연동 후 표시"
          icon={<IcReviews size={16} />}
          iconBg="rgba(251,191,36,0.1)"
          iconColor="#FBBF24"
        />
        <StatCard
          label="감사 로그"
          value="—"
          meta="금일 관리자 액션"
          icon={<IcAudit size={16} />}
          iconBg="rgba(100,116,139,0.1)"
          iconColor="#64748B"
        />
      </div>

      {/* Activity + Quick Actions */}
      <div className="cs-grid-2">
        {/* Recent Activity */}
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', margin: 0 }}>
              최근 활동
            </h3>
            <span className="cs-badge cs-badge-gray" style={{ fontSize: 11 }}>샘플 데이터</span>
          </div>
          <div className="cs-activity-list">
            {PLACEHOLDER_ACTIVITY.map((item, i) => (
              <div key={i} className="cs-activity-item">
                <div className="cs-activity-dot" style={{ background: item.dot }} />
                <span className="cs-activity-text">{item.text}</span>
                <span className="cs-activity-time">{item.time}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--cs-border)' }}>
            <Link to="/console/audit" style={{ fontSize: 13, color: 'var(--cs-accent)', textDecoration: 'none', fontWeight: 500 }}>
              전체 로그 보기 →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="cs-card">
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', margin: '0 0 16px' }}>
            빠른 작업
          </h3>
          <div className="cs-quick-actions">
            {QUICK_ACTIONS.map(action => (
              <Link key={action.path} to={action.path} className="cs-quick-item">
                <div className="cs-quick-item-icon">{action.icon}</div>
                <div>
                  <div className="cs-quick-item-text">{action.label}</div>
                  <div className="cs-quick-item-sub">{action.sub}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Phase 2 notice */}
      <div className="cs-card" style={{ marginTop: 16, borderColor: 'rgba(61,217,179,0.25)', background: 'rgba(61,217,179,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: 'rgba(61,217,179,0.12)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--cs-accent)', flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cs-text-1)', marginBottom: 2 }}>
              Phase 1 완료 — 현재 UI 뼈대 단계입니다
            </div>
            <div style={{ fontSize: 13, color: 'var(--cs-text-2)', lineHeight: 1.5 }}>
              Phase 2에서 각 섹션의 실제 API 연동과 데이터 테이블, 차트가 구현됩니다.
              사이드바의 모든 메뉴는 라우팅이 연결되어 있습니다.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
