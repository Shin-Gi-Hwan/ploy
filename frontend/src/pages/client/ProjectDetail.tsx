import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Badge from '../../components/ui/Badge'
import Spinner from '../../components/ui/Spinner'
import { getMyProject } from '../../lib/api'
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

const STATUS_STEPS: ProjectStatus[] = [
  'REQUESTED', 'REVIEWING', 'APPROVED', 'ASSIGNED', 'IN_PROGRESS', 'REVIEW', 'COMPLETED',
]

function statusVariant(s: string): 'default' | 'info' | 'success' | 'warning' | 'error' {
  if (s === 'COMPLETED') return 'success'
  if (s === 'REVIEW') return 'warning'
  if (s === 'REJECTED') return 'error'
  if (['IN_PROGRESS', 'ASSIGNED'].includes(s)) return 'info'
  return 'default'
}

export default function ClientProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    getMyProject(Number(id))
      .then(setProject)
      .catch(() => setError('프로젝트를 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [id])

  const currentStep = project ? STATUS_STEPS.indexOf(project.status as ProjectStatus) : -1

  return (
    <DashboardLayout title="프로젝트 상세">
      <div className="client-section">
        <Link
          to="/client/projects"
          style={{ fontSize: 13, color: 'var(--mint-600)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}
        >
          ← 목록으로
        </Link>

        {loading && <div className="client-loading"><Spinner /></div>}
        {error && <div className="client-error">{error}</div>}

        {!loading && !error && project && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Header card */}
            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0, marginBottom: 6 }}>{project.title}</h2>
                  <div style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>
                    {SERVICE_LABELS[project.serviceType] ?? project.serviceType}
                    &nbsp;·&nbsp;신청일 {new Date(project.createdAt).toLocaleDateString('ko-KR')}
                  </div>
                </div>
                <Badge variant={statusVariant(project.status)}>{STATUS_LABELS[project.status as ProjectStatus] ?? project.status}</Badge>
              </div>
            </div>

            {/* Progress stepper */}
            {project.status !== 'REJECTED' && (
              <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 16px' }}>진행 현황</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, overflowX: 'auto', paddingBottom: 4 }}>
                  {STATUS_STEPS.map((step, i) => {
                    const done = i <= currentStep
                    const active = i === currentStep
                    return (
                      <div key={step} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: '50%',
                            background: done ? 'var(--mint-600)' : '#f3f4f6',
                            border: active ? '2.5px solid var(--mint-600)' : '2px solid',
                            borderColor: done ? 'var(--mint-600)' : '#e5e7eb',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 13, color: done ? '#fff' : '#9ca3af',
                            fontWeight: 700,
                          }}>
                            {done && !active ? '✓' : i + 1}
                          </div>
                          <span style={{ fontSize: 11, color: done ? 'var(--mint-600)' : 'var(--text-tertiary)', fontWeight: active ? 700 : 400, whiteSpace: 'nowrap' }}>
                            {STATUS_LABELS[step]}
                          </span>
                        </div>
                        {i < STATUS_STEPS.length - 1 && (
                          <div style={{ width: 32, height: 2, background: i < currentStep ? 'var(--mint-600)' : '#e5e7eb', margin: '0 4px', marginBottom: 22, flexShrink: 0 }} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Partner info */}
            {project.freelancer && (
              <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px' }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 12px' }}>담당 파트너</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--mint-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'var(--mint-700)' }}>
                    {project.freelancer.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{project.freelancer.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{project.freelancer.email}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Deliverables */}
            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '20px 24px' }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 12px' }}>납품 파일</h3>
              {project.deliverables.length === 0 ? (
                <p style={{ fontSize: 13, color: 'var(--text-tertiary)', margin: 0 }}>아직 납품된 파일이 없습니다.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {project.deliverables.map(d => (
                    <a
                      key={d.id}
                      href={d.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '10px 14px', borderRadius: 8,
                        background: 'var(--mint-50)', border: '1px solid var(--mint-100)',
                        textDecoration: 'none', color: 'inherit',
                      }}
                    >
                      <span style={{ fontSize: 20 }}>📄</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                          v{d.version} 납품본
                        </div>
                        {d.note && <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{d.note}</div>}
                        <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                          {new Date(d.uploadedAt).toLocaleDateString('ko-KR')}
                        </div>
                      </div>
                      <span style={{ fontSize: 13, color: 'var(--mint-600)', fontWeight: 600 }}>다운로드 ↓</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
