import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  IcProjects, IcInquiries, IcUsers, IcOrders, IcPartners,
} from '../components/layout/Icons'
import { getDashboardStats, getDashboardActivity, getDashboardRevenue } from '../api/consoleApi'
import type { DashboardStats, ActivityItem, ActivityType, RevenueDataPoint } from '../api/consoleApi'

// ─── StatCard ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  change?: number          // positive = up, negative = down
  changeLabel?: string     // e.g. "vs yesterday"
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  loading?: boolean
  formatValue?: (v: number) => string
}

function StatCard({ label, value, change, changeLabel = '전일 대비', icon, iconBg, iconColor, loading, formatValue }: StatCardProps) {
  const displayValue = typeof value === 'number' && formatValue ? formatValue(value) : value

  return (
    <div className="cs-stat-card">
      <div className="cs-stat-top">
        <span className="cs-stat-label">{label}</span>
        <div className="cs-stat-icon" style={{ background: iconBg, color: iconColor }}>
          {icon}
        </div>
      </div>

      <div className="cs-stat-value">
        {loading
          ? <span style={{ display: 'inline-block', width: 52, height: 28, borderRadius: 6, background: 'var(--cs-border)', opacity: 0.6 }} />
          : displayValue}
      </div>

      {!loading && change !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 2,
            fontSize: 11.5, fontWeight: 600,
            color: change > 0 ? '#10B981' : change < 0 ? '#F43F5E' : 'var(--cs-text-3)',
          }}>
            {change > 0 ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="18 15 12 9 6 15"/></svg>
            ) : change < 0 ? (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            ) : (
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/></svg>
            )}
            {Math.abs(change)}
          </span>
          <span style={{ fontSize: 11.5, color: 'var(--cs-text-3)' }}>{changeLabel}</span>
        </div>
      )}

      {loading && (
        <div style={{ width: 80, height: 14, borderRadius: 4, background: 'var(--cs-border)', opacity: 0.5, marginTop: 6 }} />
      )}
    </div>
  )
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────

interface ChartSeriesProps {
  data: RevenueDataPoint[]
  dataKey: 'orders' | 'inquiries' | 'revenue'
  color: string
  label: string
  formatValue?: (v: number) => string
}

function MiniBarChart({ data, dataKey, color, label, formatValue }: ChartSeriesProps) {
  const values = data.map(d => d[dataKey])
  const max = Math.max(...values, 1)
  const total = values.reduce((a, b) => a + b, 0)

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cs-text-1)' }}>{label}</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--cs-text-1)' }}>
          {formatValue ? formatValue(total) : total}
        </span>
      </div>

      {/* Bars */}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 64 }}>
        {data.map((d, i) => {
          const h = Math.max((d[dataKey] / max) * 56, d[dataKey] > 0 ? 4 : 0)
          return (
            <div
              key={i}
              title={`${d.date}: ${formatValue ? formatValue(d[dataKey]) : d[dataKey]}`}
              style={{
                flex: 1,
                height: `${h}px`,
                background: color,
                borderRadius: '3px 3px 0 0',
                transition: 'height 0.3s ease',
                cursor: 'default',
                opacity: h === 0 ? 0.15 : 1,
              }}
            />
          )
        })}
      </div>

      {/* X-axis labels */}
      <div style={{ display: 'flex', gap: 5, marginTop: 6 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: 10, color: 'var(--cs-text-3)', lineHeight: 1 }}>
            {d.date.slice(5).replace('-', '/')}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Activity helpers ─────────────────────────────────────────────────────────

const ACTIVITY_META: Record<ActivityType, { dot: string; label: string }> = {
  INQUIRY_SUBMITTED:  { dot: '#3DD9B3', label: '문의 접수' },
  INQUIRY_REVIEWING:  { dot: '#60A5FA', label: '검토 중' },
  INQUIRY_APPROVED:   { dot: '#10B981', label: '문의 승인' },
  INQUIRY_REJECTED:   { dot: '#F43F5E', label: '문의 거절' },
  PROJECT_ASSIGNED:   { dot: '#8B5CF6', label: '배정 완료' },
  PROJECT_STARTED:    { dot: '#6366F1', label: '작업 시작' },
  DRAFT_UPLOADED:     { dot: '#F59E0B', label: '초안 업로드' },
  ORDER_COMPLETED:    { dot: '#3DD9B3', label: '납품 완료' },
  MEMBER_REGISTERED:  { dot: '#60A5FA', label: '회원가입' },
  PARTNER_APPLIED:    { dot: '#F59E0B', label: '파트너 신청' },
  PARTNER_APPROVED:   { dot: '#10B981', label: '파트너 승인' },
  PARTNER_REJECTED:   { dot: '#F43F5E', label: '파트너 거절' },
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60_000)
  if (m < 1)  return '방금 전'
  if (m < 60) return `${m}분 전`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}시간 전`
  return `${Math.floor(h / 24)}일 전`
}

function formatKRW(v: number): string {
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}백만`
  if (v >= 10_000)    return `${(v / 10_000).toFixed(0)}만`
  return v.toLocaleString()
}

// ─── Skeleton helpers ─────────────────────────────────────────────────────────

function Skeleton({ w, h, mt = 0 }: { w?: number | string; h: number; mt?: number }) {
  return (
    <div style={{
      width: w ?? '100%', height: h, borderRadius: 5,
      background: 'var(--cs-border)', opacity: 0.55, marginTop: mt,
    }} />
  )
}

// ─── Quick Actions ────────────────────────────────────────────────────────────

const QUICK_ACTIONS = [
  { label: '문의 관리',     sub: '대기 중인 문의를 처리하세요',       path: '/console/inquiries',     icon: <IcInquiries size={16} /> },
  { label: '파트너 승인',   sub: '신청서를 검토하세요',               path: '/console/partners',      icon: <IcPartners size={16} /> },
  { label: '프로젝트 현황', sub: '진행 중인 프로젝트를 확인하세요',   path: '/console/projects',      icon: <IcProjects size={16} /> },
  { label: '회원 관리',     sub: '회원 목록을 조회하세요',            path: '/console/users',         icon: <IcUsers size={16} /> },
]

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const [stats,    setStats]    = useState<DashboardStats | null>(null)
  const [activity, setActivity] = useState<ActivityItem[]>([])
  const [revenue,  setRevenue]  = useState<RevenueDataPoint[]>([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState<string | null>(null)

  useEffect(() => {
    Promise.all([getDashboardStats(), getDashboardActivity(), getDashboardRevenue()])
      .then(([s, a, r]) => { setStats(s); setActivity(a); setRevenue(r) })
      .catch(() => setError('데이터를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
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

      {/* ── Primary KPI Cards (6-card grid) ────────────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 16,
        marginBottom: 16,
      }}
        className="cs-kpi-grid"
      >
        <StatCard
          label="오늘 주문"
          value={stats?.todayOrders ?? 0}
          change={stats?.orderChange}
          icon={<IcOrders size={16} />}
          iconBg="rgba(61,217,179,0.12)"
          iconColor="#3DD9B3"
          loading={loading}
        />
        <StatCard
          label="오늘 문의"
          value={stats?.todayInquiries ?? 0}
          change={stats?.inquiryChange}
          icon={<IcInquiries size={16} />}
          iconBg="rgba(59,130,246,0.1)"
          iconColor="#3B82F6"
          loading={loading}
        />
        <StatCard
          label="진행 중 프로젝트"
          value={stats?.activeProjects ?? 0}
          change={stats?.projectChange}
          icon={<IcProjects size={16} />}
          iconBg="rgba(139,92,246,0.1)"
          iconColor="#8B5CF6"
          loading={loading}
        />
        <StatCard
          label="승인 대기"
          value={stats?.pendingApprovals ?? 0}
          change={stats?.approvalChange}
          icon={<IcPartners size={16} />}
          iconBg="rgba(245,158,11,0.1)"
          iconColor="#F59E0B"
          loading={loading}
        />
        <StatCard
          label="신규 회원"
          value={stats?.newMembers ?? 0}
          change={stats?.memberChange}
          icon={<IcUsers size={16} />}
          iconBg="rgba(16,185,129,0.1)"
          iconColor="#10B981"
          loading={loading}
        />
        <StatCard
          label="오늘 매출"
          value={stats?.todayRevenue ?? 0}
          change={stats?.revenueChange !== undefined ? Math.round(stats.revenueChange) : undefined}
          changeLabel="% 전일 대비"
          icon={<IcOrders size={16} />}
          iconBg="rgba(244,63,94,0.08)"
          iconColor="#F43F5E"
          loading={loading}
          formatValue={formatKRW}
        />
      </div>

      {/* ── 7-Day Charts ───────────────────────────────────────────────────── */}
      <div className="cs-card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', margin: 0 }}>
            최근 7일 현황
          </h3>
          <span className="cs-badge cs-badge-gray" style={{ fontSize: 11 }}>매출은 결제 시스템 연동 후 집계</span>
        </div>

        {loading ? (
          <div style={{ display: 'flex', gap: 24 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ flex: 1 }}>
                <Skeleton w={80} h={13} />
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5, height: 64, marginTop: 12 }}>
                  {[...Array(7)].map((_, j) => (
                    <div key={j} style={{ flex: 1, height: `${20 + Math.random() * 36}px`, borderRadius: '3px 3px 0 0', background: 'var(--cs-border)', opacity: 0.5 }} />
                  ))}
                </div>
                <Skeleton h={10} mt={6} />
              </div>
            ))}
          </div>
        ) : revenue.length > 0 ? (
          <div style={{ display: 'flex', gap: 28 }}>
            <MiniBarChart data={revenue} dataKey="orders"    color="rgba(61,217,179,0.7)"  label="주문 (프로젝트)" />
            <MiniBarChart data={revenue} dataKey="inquiries" color="rgba(96,165,250,0.7)"  label="문의 접수" />
            <MiniBarChart data={revenue} dataKey="revenue"   color="rgba(244,63,94,0.65)"  label="매출 (원)" formatValue={formatKRW} />
          </div>
        ) : (
          <p style={{ fontSize: 13, color: 'var(--cs-text-3)', margin: 0 }}>차트 데이터가 없습니다.</p>
        )}
      </div>

      {/* ── Activity Feed + Quick Actions ───────────────────────────────────── */}
      <div className="cs-grid-2">

        {/* Recent Activity */}
        <div className="cs-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', margin: 0 }}>최근 활동</h3>
            {!loading && <span className="cs-badge cs-badge-mint" style={{ fontSize: 11 }}>실시간</span>}
          </div>

          {loading ? (
            <div className="cs-activity-list">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cs-activity-item">
                  <div className="cs-activity-dot" style={{ background: 'var(--cs-border)' }} />
                  <Skeleton h={13} />
                  <Skeleton w={36} h={11} />
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p style={{ fontSize: 13, color: 'var(--cs-text-3)', margin: 0 }}>활동 내역이 없습니다.</p>
          ) : (
            <div className="cs-activity-list">
              {activity.map(item => {
                const meta = ACTIVITY_META[item.type] ?? { dot: '#94A3B8', label: item.type }
                return (
                  <div key={item.id} className="cs-activity-item">
                    <div className="cs-activity-dot" style={{ background: meta.dot }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="cs-activity-text">{item.message}</div>
                      <span style={{
                        display: 'inline-block', marginTop: 2,
                        fontSize: 10.5, color: meta.dot, fontWeight: 500,
                      }}>
                        {meta.label}
                      </span>
                    </div>
                    <span className="cs-activity-time">{timeAgo(item.createdAt)}</span>
                  </div>
                )
              })}
            </div>
          )}

          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--cs-border)' }}>
            <Link to="/console/audit" style={{ fontSize: 13, color: 'var(--cs-accent)', textDecoration: 'none', fontWeight: 500 }}>
              전체 로그 보기 →
            </Link>
          </div>
        </div>

        {/* Right column: Quick Actions + Supplementary Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Quick Actions */}
          <div className="cs-card">
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', margin: '0 0 14px' }}>빠른 작업</h3>
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

          {/* Supplementary totals */}
          <div className="cs-card">
            <h3 style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', margin: '0 0 14px' }}>누적 현황</h3>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[...Array(4)].map((_, i) => <Skeleton key={i} h={13} />)}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {[
                  { label: '전체 회원',       value: stats?.totalMembers ?? 0,               color: '#3DD9B3' },
                  { label: '전체 프로젝트',   value: stats?.totalProjects ?? 0,              color: '#60A5FA' },
                  { label: '등록 파트너',     value: stats?.totalPartners ?? 0,              color: '#8B5CF6' },
                  { label: '파트너 신청 대기', value: stats?.pendingPartnerApplications ?? 0, color: '#F59E0B' },
                ].map(row => (
                  <div key={row.label} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '9px 0', borderBottom: '1px solid var(--cs-border)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: row.color, flexShrink: 0 }} />
                      <span style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{row.label}</span>
                    </div>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--cs-text-1)' }}>
                      {row.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
