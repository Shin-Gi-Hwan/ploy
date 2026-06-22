import { useState, useEffect, useCallback } from 'react'
import {
  getInquiries, getInquiryDetail, approveInquiry, rejectInquiry,
  type ConsoleProjectListItem, type ConsoleProjectDetail,
} from '../api/consoleApi'
import Drawer from '../components/ui/Drawer'
import { Pagination, SearchIcon, useDebounce, formatDate, RejectModal } from '../components/ui/TablePage'

const STATUS_LABELS: Record<string, string> = {
  BRIEF_SUBMITTED: '브리프제출', REQUESTED: '요청됨', REVIEWING: '검토중',
  APPROVED: '승인됨', REJECTED: '거절됨',
}
const STATUS_CLASS: Record<string, string> = {
  BRIEF_SUBMITTED: 'cs-badge-amber', REQUESTED: 'cs-badge-amber', REVIEWING: 'cs-badge-blue',
  APPROVED: 'cs-badge-mint', REJECTED: 'cs-badge-red',
}
const TYPE_LABELS: Record<string, string> = {
  BUSINESS_CARD: '명함', PRESENTATION: '프레젠테이션', WEBSITE: '웹사이트',
  LOGO: '로고', DETAIL_PAGE: '상세페이지', MOBILE_APP: '모바일앱',
}

function InquiryDrawer({ inquiryId, onClose, onUpdated }: {
  inquiryId: number | null; onClose: () => void; onUpdated: (item: ConsoleProjectListItem) => void
}) {
  const [detail, setDetail] = useState<ConsoleProjectDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)

  useEffect(() => {
    if (!inquiryId) { setDetail(null); return }
    setLoading(true)
    getInquiryDetail(inquiryId).then(setDetail).finally(() => setLoading(false))
  }, [inquiryId])

  const handleApprove = async () => {
    if (!detail) return
    setSaving(true)
    try { const u = await approveInquiry(detail.id); setDetail(d => d ? { ...d, status: u.status } : d); onUpdated(u) }
    finally { setSaving(false) }
  }

  const handleReject = async (reason: string) => {
    if (!detail) return
    setSaving(true)
    try { const u = await rejectInquiry(detail.id, reason); setDetail(d => d ? { ...d, status: u.status } : d); onUpdated(u); setRejectOpen(false) }
    finally { setSaving(false) }
  }

  const isPending = detail && (detail.status === 'REQUESTED' || detail.status === 'REVIEWING' || detail.status === 'BRIEF_SUBMITTED')

  return (
    <>
      <Drawer open={!!inquiryId} onClose={onClose} title="문의 상세" width={480}>
        {loading && <div className="cs-loading">불러오는 중...</div>}
        {!loading && detail && (
          <>
            <div style={{ marginBottom: 20, display: 'flex', gap: 8 }}>
              <span className={`cs-badge ${STATUS_CLASS[detail.status] ?? 'cs-badge-gray'}`} style={{ fontSize: 13, padding: '4px 12px' }}>
                {STATUS_LABELS[detail.status] ?? detail.status}
              </span>
              <span className="cs-badge cs-badge-gray" style={{ fontSize: 12, padding: '4px 12px' }}>
                {TYPE_LABELS[detail.type] ?? detail.type}
              </span>
            </div>

            <div className="cs-detail-section">
              <p className="cs-detail-section-title">문의 정보</p>
              <div className="cs-detail-field"><span className="cs-detail-label">제목</span><span className="cs-detail-value">{detail.title}</span></div>
              <div className="cs-detail-field"><span className="cs-detail-label">의뢰인</span><span className="cs-detail-value">{detail.ownerName}{detail.isGuest ? ' (비회원)' : ''}</span></div>
              <div className="cs-detail-field"><span className="cs-detail-label">이메일</span><span className="cs-detail-value mono">{detail.ownerEmail ?? '—'}</span></div>
              <div className="cs-detail-field"><span className="cs-detail-label">접수일</span><span className="cs-detail-value">{formatDate(detail.createdAt)}</span></div>
            </div>

            {detail.rejectionReason && (
              <div className="cs-detail-section">
                <p className="cs-detail-section-title">거절 사유</p>
                <p style={{ fontSize: 13, color: '#E11D48', lineHeight: 1.6, margin: 0 }}>{detail.rejectionReason}</p>
              </div>
            )}

            {isPending && (
              <div className="cs-drawer-actions">
                <button className="cs-btn cs-btn-primary" disabled={saving} onClick={handleApprove}>승인</button>
                <button className="cs-btn cs-btn-secondary" style={{ color: '#E11D48' }} disabled={saving} onClick={() => setRejectOpen(true)}>거절</button>
              </div>
            )}
          </>
        )}
      </Drawer>
      <RejectModal
        open={rejectOpen} onClose={() => setRejectOpen(false)} onConfirm={handleReject}
        loading={saving} title="문의 거절" desc="거절 사유를 입력해 주세요. 의뢰인에게 전달됩니다."
      />
    </>
  )
}

export default function Inquiries() {
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
      const res = await getInquiries(page, SIZE, statusFilter || undefined, debouncedQuery || undefined)
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
          <h1 className="cs-page-title">문의 관리</h1>
          <p className="cs-page-subtitle">서비스 문의를 검토하고 승인 또는 거절을 처리합니다.</p>
        </div>
      </div>
      <div className="cs-filter-bar">
        <div className="cs-filter-search">
          <SearchIcon />
          <input placeholder="제목, 의뢰인 검색..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="cs-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="REQUESTED">요청됨</option>
          <option value="BRIEF_SUBMITTED">브리프제출</option>
          <option value="REVIEWING">검토중</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">거절됨</option>
        </select>
      </div>
      <div className="cs-table-wrap">
        {loading ? <div className="cs-loading">불러오는 중...</div>
        : items.length === 0 ? <div className="cs-table-empty">문의가 없습니다.</div>
        : (
          <table className="cs-table">
            <thead><tr><th>제목 / 유형</th><th>상태</th><th>의뢰인</th><th>접수일</th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} onClick={() => setSelectedId(p.id)}>
                  <td><div className="cs-table-name">{p.title}</div><div className="cs-table-sub">{TYPE_LABELS[p.type] ?? p.type}</div></td>
                  <td><span className={`cs-badge ${STATUS_CLASS[p.status] ?? 'cs-badge-gray'}`}>{STATUS_LABELS[p.status] ?? p.status}</span></td>
                  <td><div className="cs-table-name">{p.ownerName}</div><div className="cs-table-sub">{p.ownerEmail ?? '—'}</div></td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{formatDate(p.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} totalElements={total} size={SIZE} onChange={setPage} />}
      </div>
      <InquiryDrawer inquiryId={selectedId} onClose={() => setSelectedId(null)} onUpdated={handleUpdated} />
    </div>
  )
}
