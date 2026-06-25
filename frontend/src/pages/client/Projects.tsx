import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { getMyProjects } from '../../lib/api'
import type { Project, ProjectStatus } from '../../types/api'

const STATUS_LABELS: Record<ProjectStatus, string> = {
  REQUESTED: '요청됨', REVIEWING: '검토중', APPROVED: '승인됨',
  ASSIGNED: '배정됨', IN_PROGRESS: '진행중', REVIEW: '검수중',
  COMPLETED: '완료', REJECTED: '거절됨',
  BRIEF_SUBMITTED: '브리프제출', DELIVERED: '납품됨',
}

const SERVICE_LABELS: Record<string, string> = {
  BUSINESS_CARD: '명함', PRESENTATION: '프레젠테이션', WEBSITE: '웹사이트',
  LOGO: '로고', DETAIL_PAGE: '상세페이지', MOBILE_APP: '모바일앱',
}

function statusVariant(s: string): 'default' | 'info' | 'success' | 'warning' | 'error' {
  if (s === 'COMPLETED') return 'success'
  if (s === 'REVIEW') return 'warning'
  if (s === 'REJECTED') return 'error'
  if (['IN_PROGRESS', 'ASSIGNED'].includes(s)) return 'info'
  return 'default'
}

export default function ClientProjects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'done'>('all')

  useEffect(() => {
    getMyProjects()
      .then(setProjects)
      .catch(() => setError('프로젝트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = projects.filter(p => {
    if (filter === 'active') return !['COMPLETED', 'REJECTED'].includes(p.status)
    if (filter === 'done') return ['COMPLETED', 'REJECTED'].includes(p.status)
    return true
  })

  return (
    <DashboardLayout title="내 프로젝트">
      <div className="client-section">
        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {([['all', '전체'], ['active', '진행중'], ['done', '완료/거절']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              style={{
                padding: '6px 16px', borderRadius: 99, fontSize: 13, fontWeight: 600,
                border: '1.5px solid',
                borderColor: filter === val ? 'var(--mint-600)' : 'var(--border-default)',
                background: filter === val ? 'var(--mint-600)' : '#fff',
                color: filter === val ? '#fff' : 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >{label}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--text-tertiary)', alignSelf: 'center' }}>
            총 {filtered.length}건
          </span>
        </div>

        {loading && <div className="client-loading"><Spinner /></div>}
        {error && <div className="client-error">{error}</div>}

        {!loading && !error && filtered.length === 0 && (
          <div className="client-empty">
            <p className="client-empty-text">
              {filter === 'all' ? '아직 프로젝트가 없습니다.' : '해당하는 프로젝트가 없습니다.'}
            </p>
            {filter === 'all' && (
              <Link to="/client/request">
                <button className="btn btn-primary btn-md">서비스 신청하기</button>
              </Link>
            )}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filtered.map(p => (
              <Link
                key={p.id}
                to={`/client/projects/${p.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div style={{
                  background: '#fff', border: '1px solid var(--border-default)',
                  borderRadius: 12, padding: '16px 20px',
                  display: 'flex', alignItems: 'center', gap: 16,
                  transition: 'box-shadow 0.15s',
                  cursor: 'pointer',
                }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'var(--mint-50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0,
                  }}>📋</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                      {SERVICE_LABELS[p.serviceType] ?? p.serviceType} · {new Date(p.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <Badge variant={statusVariant(p.status)}>{STATUS_LABELS[p.status as ProjectStatus] ?? p.status}</Badge>
                  <span style={{ fontSize: 18, color: 'var(--text-tertiary)', flexShrink: 0 }}>›</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
