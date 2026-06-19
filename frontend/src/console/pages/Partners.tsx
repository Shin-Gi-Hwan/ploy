import { useState, useEffect, useCallback } from 'react'
import {
  getPartners, getPartnerDetail, approvePartner, rejectPartner, updatePartnerActive,
  type ConsolePartnerListItem, type ConsolePartnerDetail,
} from '../api/consoleApi'
import Drawer from '../components/ui/Drawer'

// ─── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  PENDING: '검토중', APPROVED: '승인됨', REJECTED: '거절됨', DISABLED: '비활성화',
}
const STATUS_CLASS: Record<string, string> = {
  PENDING: 'cs-badge-amber', APPROVED: 'cs-badge-mint',
  REJECTED: 'cs-badge-red', DISABLED: 'cs-badge-gray',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function useDebounce<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// ─── Reject Modal ────────────────────────────────────────────────────────────────

function RejectModal({
  open, onClose, onConfirm, loading,
}: { open: boolean; onClose: () => void; onConfirm: (reason: string) => void; loading: boolean }) {
  const [reason, setReason] = useState('')

  useEffect(() => { if (!open) setReason('') }, [open])

  if (!open) return null
  return (
    <div className="cs-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cs-modal">
        <p className="cs-modal-title">파트너 신청 거절</p>
        <p className="cs-modal-desc">거절 사유를 입력해 주세요. 파트너에게 전달됩니다.</p>
        <textarea
          placeholder="거절 사유 입력..."
          value={reason}
          onChange={e => setReason(e.target.value)}
          autoFocus
        />
        <div className="cs-modal-actions">
          <button className="cs-btn cs-btn-secondary" onClick={onClose} disabled={loading}>취소</button>
          <button
            className="cs-btn cs-btn-primary"
            style={{ background: '#E11D48', color: 'white' }}
            disabled={!reason.trim() || loading}
            onClick={() => onConfirm(reason.trim())}
          >
            {loading ? '처리중...' : '거절 확인'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Pagination ──────────────────────────────────────────────────────────────────

function Pagination({
  page, totalPages, totalElements, size, onChange,
}: { page: number; totalPages: number; totalElements: number; size: number; onChange: (p: number) => void }) {
  const start = page * size + 1
  const end = Math.min((page + 1) * size, totalElements)
  const delta = 2
  const pages: number[] = []
  for (let i = Math.max(0, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) pages.push(i)

  return (
    <div className="cs-pagination">
      <span className="cs-pagination-info">
        {totalElements === 0 ? '결과 없음' : `${start}–${end} / ${totalElements}건`}
      </span>
      <div className="cs-pagination-btns">
        <button className="cs-page-btn" disabled={page === 0} onClick={() => onChange(0)}>{'«'}</button>
        <button className="cs-page-btn" disabled={page === 0} onClick={() => onChange(page - 1)}>{'‹'}</button>
        {pages.map(p => (
          <button key={p} className={`cs-page-btn${p === page ? ' active' : ''}`} onClick={() => onChange(p)}>{p + 1}</button>
        ))}
        <button className="cs-page-btn" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>{'›'}</button>
        <button className="cs-page-btn" disabled={page >= totalPages - 1} onClick={() => onChange(totalPages - 1)}>{'»'}</button>
      </div>
    </div>
  )
}

// ─── Partner Drawer ──────────────────────────────────────────────────────────────

function PartnerDrawer({
  appId, onClose, onUpdated,
}: {
  appId: number | null
  onClose: () => void
  onUpdated: (item: ConsolePartnerListItem) => void
}) {
  const [detail, setDetail] = useState<ConsolePartnerDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)

  useEffect(() => {
    if (!appId) { setDetail(null); return }
    setLoading(true)
    getPartnerDetail(appId).then(setDetail).finally(() => setLoading(false))
  }, [appId])

  const handleApprove = async () => {
    if (!detail) return
    setSaving(true)
    try {
      const updated = await approvePartner(detail.applicationId)
      setDetail(d => d ? { ...d, status: updated.status } : d)
      onUpdated(updated)
    } finally {
      setSaving(false)
    }
  }

  const handleReject = async (reason: string) => {
    if (!detail) return
    setSaving(true)
    try {
      const updated = await rejectPartner(detail.applicationId, reason)
      setDetail(d => d ? { ...d, status: updated.status, rejectionReason: reason } : d)
      onUpdated(updated)
      setRejectOpen(false)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async () => {
    if (!detail) return
    const newActive = !detail.visible
    setSaving(true)
    try {
      const updated = await updatePartnerActive(detail.applicationId, newActive)
      setDetail(d => d ? { ...d, visible: updated.visible } : d)
      onUpdated(updated)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <Drawer open={!!appId} onClose={onClose} title="파트너 상세">
        {loading && <div className="cs-loading">불러오는 중...</div>}
        {!loading && detail && (
          <>
            {/* Status badge */}
            <div style={{ marginBottom: 20 }}>
              <span className={`cs-badge ${STATUS_CLASS[detail.status] ?? 'cs-badge-gray'}`} style={{ fontSize: 13, padding: '4px 12px' }}>
                {STATUS_LABELS[detail.status] ?? detail.status}
              </span>
            </div>

            {/* Basic info */}
            <div className="cs-detail-section">
              <p className="cs-detail-section-title">신청자 정보</p>
              <div className="cs-detail-field">
                <span className="cs-detail-label">이름</span>
                <span className="cs-detail-value">{detail.name}</span>
              </div>
              <div className="cs-detail-field">
                <span className="cs-detail-label">이메일</span>
                <span className="cs-detail-value mono">{detail.email}</span>
              </div>
              <div className="cs-detail-field">
                <span className="cs-detail-label">신청일</span>
                <span className="cs-detail-value">{formatDate(detail.appliedAt)}</span>
              </div>
              {detail.reviewedAt && (
                <div className="cs-detail-field">
                  <span className="cs-detail-label">검토일</span>
                  <span className="cs-detail-value">{formatDate(detail.reviewedAt)}</span>
                </div>
              )}
            </div>

            {/* Introduction */}
            {detail.introduction && (
              <div className="cs-detail-section">
                <p className="cs-detail-section-title">소개</p>
                <p style={{ fontSize: 13, color: 'var(--cs-text-1)', lineHeight: 1.6, margin: 0 }}>
                  {detail.introduction}
                </p>
              </div>
            )}

            {/* Profile */}
            {(detail.specialties || detail.skills || detail.yearsOfExperience != null) && (
              <div className="cs-detail-section">
                <p className="cs-detail-section-title">프로필</p>
                {detail.specialties && (
                  <div className="cs-detail-field">
                    <span className="cs-detail-label">전문 분야</span>
                    <span className="cs-detail-value">{detail.specialties}</span>
                  </div>
                )}
                {detail.skills && (
                  <div className="cs-detail-field">
                    <span className="cs-detail-label">스킬</span>
                    <span className="cs-detail-value">{detail.skills}</span>
                  </div>
                )}
                {detail.yearsOfExperience != null && (
                  <div className="cs-detail-field">
                    <span className="cs-detail-label">경력</span>
                    <span className="cs-detail-value">{detail.yearsOfExperience}년</span>
                  </div>
                )}
                {detail.averageRating != null && (
                  <div className="cs-detail-field">
                    <span className="cs-detail-label">평균 평점</span>
                    <span className="cs-detail-value">⭐ {detail.averageRating.toFixed(1)}</span>
                  </div>
                )}
                {detail.completedCount != null && (
                  <div className="cs-detail-field">
                    <span className="cs-detail-label">완료 프로젝트</span>
                    <span className="cs-detail-value">{detail.completedCount}건</span>
                  </div>
                )}
                {detail.visible != null && (
                  <div className="cs-detail-field">
                    <span className="cs-detail-label">프로필 공개</span>
                    <label className="cs-toggle" onClick={e => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={!!detail.visible}
                        disabled={saving}
                        onChange={handleToggleActive}
                      />
                      <span className="cs-toggle-slider" />
                    </label>
                  </div>
                )}
              </div>
            )}

            {/* Rejection reason */}
            {detail.rejectionReason && (
              <div className="cs-detail-section">
                <p className="cs-detail-section-title">거절 사유</p>
                <p style={{ fontSize: 13, color: '#E11D48', lineHeight: 1.6, margin: 0 }}>
                  {detail.rejectionReason}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="cs-drawer-actions">
              {detail.status === 'PENDING' && (
                <>
                  <button className="cs-btn cs-btn-primary" disabled={saving} onClick={handleApprove}>
                    승인
                  </button>
                  <button
                    className="cs-btn cs-btn-secondary"
                    style={{ color: '#E11D48' }}
                    disabled={saving}
                    onClick={() => setRejectOpen(true)}
                  >
                    거절
                  </button>
                </>
              )}
              {detail.status === 'APPROVED' && detail.visible != null && (
                <button className="cs-btn cs-btn-secondary" disabled={saving} onClick={handleToggleActive}>
                  {detail.visible ? '비활성화' : '활성화'}
                </button>
              )}
            </div>
          </>
        )}
      </Drawer>

      <RejectModal
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        onConfirm={handleReject}
        loading={saving}
      />
    </>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────────

export default function Partners() {
  const [items, setItems] = useState<ConsolePartnerListItem[]>([])
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
      const res = await getPartners(page, SIZE, statusFilter || undefined, debouncedQuery || undefined)
      setItems(res.content)
      setTotal(res.totalElements)
      setTotalPages(res.totalPages)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, debouncedQuery])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [statusFilter, debouncedQuery])

  const handleUpdated = (updated: ConsolePartnerListItem) => {
    setItems(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">파트너 관리</h1>
          <p className="cs-page-subtitle">외주 파트너 신청을 승인 / 거절하고 활성화 상태를 관리합니다.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="cs-filter-bar">
        <div className="cs-filter-search">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <input
            placeholder="이름 또는 이메일 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <select className="cs-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="PENDING">검토중</option>
          <option value="APPROVED">승인됨</option>
          <option value="REJECTED">거절됨</option>
          <option value="DISABLED">비활성화</option>
        </select>
      </div>

      {/* Table */}
      <div className="cs-table-wrap">
        {loading ? (
          <div className="cs-loading">불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="cs-table-empty">검색 결과가 없습니다.</div>
        ) : (
          <table className="cs-table">
            <thead>
              <tr>
                <th>이름 / 이메일</th>
                <th>상태</th>
                <th>전문 분야</th>
                <th>평점 / 완료</th>
                <th>신청일</th>
              </tr>
            </thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id} onClick={() => setSelectedId(p.id)}>
                  <td>
                    <div className="cs-table-name">{p.name}</div>
                    <div className="cs-table-sub">{p.email}</div>
                  </td>
                  <td>
                    <span className={`cs-badge ${STATUS_CLASS[p.status] ?? 'cs-badge-gray'}`}>
                      {STATUS_LABELS[p.status] ?? p.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--cs-text-2)', fontSize: 13 }}>
                    {p.specialties ?? '—'}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>
                    {p.averageRating != null ? `⭐ ${p.averageRating.toFixed(1)}` : '—'}
                    {p.completedCount != null && <span style={{ marginLeft: 6, color: 'var(--cs-text-3)' }}>/{p.completedCount}건</span>}
                  </td>
                  <td style={{ color: 'var(--cs-text-2)', fontSize: 13 }}>{formatDate(p.appliedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && totalPages > 1 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalElements={total}
            size={SIZE}
            onChange={setPage}
          />
        )}
      </div>

      {/* Drawer */}
      <PartnerDrawer
        appId={selectedId}
        onClose={() => setSelectedId(null)}
        onUpdated={handleUpdated}
      />
    </div>
  )
}
