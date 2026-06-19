import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IcProjects, IcInquiries, IcUsers, IcOrders,
  IcNotifications, IcPartners,
} from '../components/layout/Icons'
import { getDashboardStats, getDashboardActivity } from '../api/consoleApi'
import type { DashboardStats, ActivityItem } from '../api/consoleApi'

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  meta?: string
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  loading?: boolean
}

function StatCard({ label, value, meta, icon, iconBg, iconColor, loading }: StatCardProps) {
  return (
    <div className="cs-stat-card">
      <div className="cs-stat-top">
        <span className="cs-stat-label">{label}</span>
        <div className="cs-stat-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>
      <div className="cs-stat-value">
        {loading ? (
          <span style={{ display: 'inline-block', width: 48, height: 28, borderRadius: 6, background: 'var(--cs-border)', opacity: 0.6 }} />
        ) : value}
      </div>
      {meta && <div className="cs-stat-meta">{meta}</div>}
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function activityDot(type: ActivityItem['type']): string {
  if (type === 'project') return '#3DD9B3'
  if (type === 'member') return '#60A5FA'
  return '#F59E0B'
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return '방금 전'
  if (minutes < 60) return `${minutes}분 전`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}시간 전`
  const days = Math.floor(hours / 24)
  return `${days}일 전`
}

const QUICK_ACTIONS = [
  { label: '문의 관리',       sub: '대기 중인 문의를 처리하세요',       path: '/console/inquiries',     icon: <IcInquiries size={16} /> },
  { label: '파트너 승인',     sub: '신청서를 검토하세요',               path: '/console/partners',      icon: <IcPartners size={16} /> },
  { label: '프로젝트 현황',   sub: '진행 중인 프로젝트를 확인하세요',   path: '/console/projects',      icon: <IcProjects size={16} /> },
  { label: '알림 발송',       sub: '공지 또는 알림을 보내세요',         path: '/console/notifications', icon: <IcNotifications size={16} /> },
]

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getDashboardStats(), getDashboardActivity()])
      .then(([s, a]) => {
        setStats(s)
        setActivity(a)
      })
      .catch(() => setError('데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* Header */}
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">대시보드</h1>
          <p className="cs-page-subtitle">Ploy 운영 현황을 한눈에 확인하세요.</p>
        </div>
        {error && (
          <span style={{ fontSize: 12, color: '#F43F5E', background: 'rgba(244,63,94,0.08)', padding: '4px 10px', borderRadius: 6 }}>
            {error}
          </span>
        )}
      </div>

      {/* Stat Cards — Row 1 */}
      <div className="cs-stat-grid">
        <StatCard
          label="전체 회원"
          value={stats?.totalMembers ?? '—'}
          meta={stats ? `오늘 +${stats.newMembersToday}명 가입` : undefined}
          icon={<IcUsers size={16} />}
          iconBg="rgba(61,217,179,0.12)"
          iconColor="#3DD9B3"
          loading={loading}
        />
        <StatCard
          label="파트너"
          value={stats?.totalPartners ?? '—'}
          meta={stats ? `신청 대기 ${stats.pendingPartnerApplications}건` : undefined}
          icon={<IcPartners size={16} />}
          iconBg="rgba(59,130,246,0.1)"
          iconColor="#3B82F6"
          loading={loading}
        />
        <StatCard
          label="진행 중 프로젝트"
          value={stats?.activeProjects ?? '—'}
          meta={stats ? `전체 ${stats.totalProjects}건` : undefined}
          icon={<IcProjects size={16} />}
          iconBg="rgba(139,92,246,0.1)"
          iconColor="#8B5CF6"
          loading={loading}
        />
        <StatCard
          label="승인 대기"
          value={stats ? (stats.pendingApprovals + stats.pendingPartnerApplications) : '—'}
          meta="프로젝트 + 파트너 신청"
          icon={<IcOrders size={16} />}
          iconBg="rgba(245,158,11,0.1)"
          iconColor="#F59E0B"
          loading={loading}
        />
      </div>

      {/* Stat Cards — Row 2 */}
      <div className="cs-stat-grid" style={{ marginBottom: 24 }}>
        <StatCard
          label="오늘 신규 프로젝트"
          value={stats?.newProjectsToday ?? '—'}
          meta="금일 00:00 이후"
          icon={<IcInquiries size={16} />}
          iconBg="rgba(16,185,129,0.1)"
          iconColor="#10B981"
          loading={loading}
        />
        <StatCard
          label="프로젝트 검토 요청"
          value={stats?.pendingApprovals ?? '—'}
          meta="REQUESTED 상태"
          icon={<IcProjects size={16} />}
          iconBg="rgba(244,63,94,0.1)"
          iconColor="#F43F5E"
          loading={loading}
        />
        <StatCard
          label="파트너 신청 대기"
          value={stats?.pendingPartnerApplications ?? '—'}
          meta="PENDING 상태"
          icon={<IcPartners size={16} />}
          iconBg="rgba(251,191,36,0.1)"
          iconColor="#FBBF24"
          loading={loading}
        />
        <StatCard
          label="오늘 신규 회원"
          value={stats?.newMembersToday ?? '—'}
          meta="금일 00:00 이후"
          icon={<IcUsers size={16} />}
          iconBg="rgba(100,116,139,0.1)"
          iconColor="#64748B"
          loading={loading}
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
            {!loading && (
              <span className="cs-badge cs-badge-mint" style={{ fontSize: 11 }}>실시간</span>
            )}
          </div>

          {loading ? (
            <div className="cs-activity-list">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="cs-activity-item">
                  <div className="cs-activity-dot" style={{ background: 'var(--cs-border)' }} />
                  <span style={{ flex: 1, height: 14, borderRadius: 4, background: 'var(--cs-border)', opacity: 0.6 }} />
                  <span style={{ width: 40, height: 12, borderRadius: 4, background: 'var(--cs-border)', opacity: 0.6 }} />
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--cs-text-3)', margin: 0 }}>활동 내역이 없습니다.</p>
          ) : (
            <div className="cs-activity-list">
              {activity.map((item, i) => (
                <div key={i} className="cs-activity-item">
                  <div className="cs-activity-dot" style={{ background: activityDot(item.type) }} />
                  <span className="cs-activity-text">{item.description}</span>
                  <span className="cs-activity-time">{timeAgo(item.timestamp)}</span>
                </div>
              ))}
            </div>
          )}

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
    </div>
  )
}
