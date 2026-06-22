import { useState, useEffect, useCallback } from 'react'
import {
  getProjects, getProjectDetail, updateProjectStatus, addProjectNote,
  type ConsoleProjectListItem, type ConsoleProjectDetail,
} from '../api/consoleApi'
import Drawer from '../components/ui/Drawer'
import { Pagination, SearchIcon, useDebounce, formatDate } from '../components/ui/TablePage'

const STATUS_LABELS: Record<string, string> = {
  BRIEF_SUBMITTED: '브리프제출', IN_PROGRESS: '진행중', REVIEW: '검수중',
  DELIVERED: '납품됨', REQUESTED: '요청됨', REVIEWING: '검토중',
  APPROVED: '승인됨', ASSIGNED: '배정됨', COMPLETED: '완료', REJECTED: '거절됨',
}
const STATUS_CLASS: Record<string, string> = {
  BRIEF_SUBMITTED: 'cs-badge-amber', IN_PROGRESS: 'cs-badge-blue', REVIEW: 'cs-badge-blue',
  DELIVERED: 'cs-badge-mint', REQUESTED: 'cs-badge-amber', REVIEWING: 'cs-badge-amber',
  APPROVED: 'cs-badge-mint', ASSIGNED: 'cs-badge-blue', COMPLETED: 'cs-badge-mint', REJECTED: 'cs-badge-red',
}
const TYPE_LABELS: Record<string, string> = {
  BUSINESS_CARD: '명함', PRESENTATION: '프레젠테이션', WEBSITE: '웹사이트',
  LOGO: '로고', DETAIL_PAGE: '상세페이지', MOBILE_APP: '모바일앱',
}
const ALL_STATUSES = ['BRIEF_SUBMITTED','IN_PROGRESS','REVIEW','DELIVERED','REQUESTED','REVIEWING','APPROVED','ASSIGNED','COMPLETED','REJECTED']

function ProjectDrawer({ projectId, onClose, onUpdated }: {
  projectId: number | null; onClose: () => void; onUpdated: (item: ConsoleProjectListItem) => void
}) {
  const [detail, setDetail] = useState<ConsoleProjectDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [newStatus, setNewStatus] = useState('')

  useEffect(() => {
    if (!projectId) { setDetail(null); return }
    setLoading(true)
    getProjectDetail(projectId).then(d => { setDetail(d); setNote(d.adminNote ?? '') }).finally(() => setLoading(false))
  }, [projectId])

  const handleSaveNote = async () => {
    if (!detail) return
    setSaving(true)
    try { const u = await addProjectNote(detail.id, note); onUpdated(u) }
    finally { setSaving(false) }
  }

  const handleStatusChange = async () => {
    if (!detail || !newStatus) return
    setSaving(true)
    try {
      const u = await updateProjectStatus(detail.id, newStatus)
      setDetail(d => d ? { ...d, status: u.status } : d)
      onUpdated(u); setNewStatus('')
    } finally { setSaving(false) }
  }

  return (
    <Drawer open={!!projectId} onClose={onClose} title="프로젝트 상세" width={500}>
      {loading && <div className="cs-loading">불러오는 중...</div>}
      {!loading && detail && (
        <>
          <div style={{ marginBottom: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className={`cs-badge ${STATUS_CLASS[detail.status] ?? 'cs-badge-gray'}`} style={{ fontSize: 13, padding: '4px 12px' }}>
              {STATUS_LABELS[detail.status] ?? detail.status}
            </span>
            <span className="cs-badge cs-badge-gray" style={{ fontSize: 12, padding: '4px 12px' }}>
              {TYPE_LABELS[detail.type] ?? detail.type}
            </span>
          </div>

          <div className="cs-detail-section">
            <p className="cs-detail-section-title">프로젝트 정보</p>
            <div className="cs-detail-field"><span className="cs-detail-label">제목</span><span className="cs-detail-value">{detail.title}</span></div>
            <div className="cs-detail-field"><span className="cs-detail-label">의뢰인</span><span className="cs-detail-value">{detail.ownerName}{detail.isGuest ? ' (비회원)' : ''}</span></div>
            <div className="cs-detail-field"><span className="cs-detail-label">이메일</span><span className="cs-detail-value mono">{detail.ownerEmail ?? '—'}</span></div>
            <div className="cs-detail-field"><span className="cs-detail-label">파트너</span><span className="cs-detail-value">{detail.freelancerName ?? '미배정'}</span></div>
            <div className="cs-detail-field"><span className="cs-detail-label">생성일</span><span className="cs-detail-value">{formatDate(detail.createdAt)}</span></div>
          </div>

          {detail.rejectionReason && (
            <div className="cs-detail-section">
              <p className="cs-detail-section-title">거절 사유</p>
              <p style={{ fontSize: 13, color: '#E11D48', lineHeight: 1.6, margin: 0 }}>{detail.rejectionReason}</p>
            </div>
          )}

          {detail.deliverables.length > 0 && (
            <div className="cs-detail-section">
              <p className="cs-detail-section-title">납품 파일 ({detail.deliverables.length}개)</p>
              <div className="cs-mini-list">
                {detail.deliverables.map(d => (
                  <div key={d.id} className="cs-mini-list-item">
                    <div><div className="name">v{d.version}</div><div className="sub">{d.note ?? ''}</div></div>
                    <a href={d.fileUrl} target="_blank" rel="noreferrer" className="cs-table-action-btn success" onClick={e => e.stopPropagation()}>다운로드</a>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="cs-detail-section">
            <p className="cs-detail-section-title">상태 변경</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <select className="cs-filter-select" style={{ flex: 1 }} value={newStatus} onChange={e => setNewStatus(e.target.value)}>
                <option value="">상태 선택...</option>
                {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
              </select>
              <button className="cs-btn cs-btn-primary" disabled={!newStatus || saving} onClick={handleStatusChange}>변경</button>
            </div>
          </div>

          <div className="cs-detail-section">
            <p className="cs-detail-section-title">관리자 메모</p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              style={{ width: '100%', minHeight: 80, padding: '8px 10px', border: '1px solid var(--cs-border)', borderRadius: 'var(--cs-radius-sm)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: 'var(--cs-bg)' }}
              placeholder="내부 메모..."
            />
            <button className="cs-btn cs-btn-secondary" style={{ marginTop: 8 }} disabled={saving} onClick={handleSaveNote}>저장</button>
          </div>
        </>
      )}
    </Drawer>
  )
}

export default function Projects() {
  const [items, setItems] = useState<ConsoleProjectListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProjects(page, SIZE, statusFilter || undefined, debouncedQuery || undefined)
      setItems(res.content); setTotal(res.totalElements); setTotalPages(res.totalPages)
    } finally { setLoading(false) }
  }, [page, statusFilter, debouncedQuery])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [statusFilter, debouncedQuery])

  const handleUpdated = (u: ConsoleProjectListItem) => setItems(prev => prev.map(p => p.id === u.id ? u : p))

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">프로젝트 관리</h1>
          <p className="cs-page-subtitle">모든 프로젝트의 상태를 관리하고 파트너를 배정합니다.</p>
        </div>
      </div>
      <div className="cs-filter-bar">
        <div className="cs-filter-search">
          <SearchIcon />
          <input placeholder="제목, 의뢰인 검색..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="cs-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div className="cs-table-wrap">
        {loading ? <div className="cs-loading">불러오는 중...</div>
        : items.length === 0 ? <div className="cs-table-empty">프로젝트가 없습니다.</div>
        : (
          <table className="cs-table">
            <thead><tr><th>제목 / 유형</th><th>상태</th><th>의뢰인</th><th>파트너</th><th>생성일</th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} onClick={() => setSelectedId(p.id)}>
                  <td><div className="cs-table-name">{p.title}</div><div className="cs-table-sub">{TYPE_LABELS[p.type] ?? p.type}</div></td>
                  <td><span className={`cs-badge ${STATUS_CLASS[p.status] ?? 'cs-badge-gray'}`}>{STATUS_LABELS[p.status] ?? p.status}</span></td>
                  <td><div className="cs-table-name">{p.ownerName}</div><div className="cs-table-sub">{p.ownerEmail ?? '—'}</div></td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{p.freelancerName ?? <span style={{ color: 'var(--cs-text-3)' }}>미배정</span>}</td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} totalElements={total} size={SIZE} onChange={setPage} />}
      </div>
      <ProjectDrawer projectId={selectedId} onClose={() => setSelectedId(null)} onUpdated={handleUpdated} />
    </div>
  )
}
