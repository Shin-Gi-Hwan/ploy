/**
 * Shared UI primitives for console table pages.
 * Keeps individual page files lean.
 */
import { useEffect, useState } from 'react'

// ── useDebounce ──────────────────────────────────────────────────────────────────
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(id)
  }, [value, delay])
  return debounced
}

// ── Pagination ───────────────────────────────────────────────────────────────────
export function Pagination({
  page, totalPages, totalElements, size, onChange, unit = '건',
}: {
  page: number; totalPages: number; totalElements: number
  size: number; onChange: (p: number) => void; unit?: string
}) {
  const start = page * size + 1
  const end = Math.min((page + 1) * size, totalElements)
  const delta = 2
  const pages: number[] = []
  for (let i = Math.max(0, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) pages.push(i)

  return (
    <div className="cs-pagination">
      <span className="cs-pagination-info">
        {totalElements === 0 ? '결과 없음' : `${start}–${end} / ${totalElements}${unit}`}
      </span>
      <div className="cs-pagination-btns">
        <button className="cs-page-btn" disabled={page === 0} onClick={() => onChange(0)}>«</button>
        <button className="cs-page-btn" disabled={page === 0} onClick={() => onChange(page - 1)}>‹</button>
        {pages.map(p => (
          <button key={p} className={`cs-page-btn${p === page ? ' active' : ''}`} onClick={() => onChange(p)}>{p + 1}</button>
        ))}
        <button className="cs-page-btn" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>›</button>
        <button className="cs-page-btn" disabled={page >= totalPages - 1} onClick={() => onChange(totalPages - 1)}>»</button>
      </div>
    </div>
  )
}

// ── SearchIcon ───────────────────────────────────────────────────────────────────
export function SearchIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  )
}

// ── formatDate ───────────────────────────────────────────────────────────────────
export function formatDate(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

export function formatDateTime(iso: string | null | undefined) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

// ── RejectModal ──────────────────────────────────────────────────────────────────
export function RejectModal({
  open, onClose, onConfirm, loading, title = '거절', desc = '거절 사유를 입력해 주세요.',
}: {
  open: boolean; onClose: () => void; onConfirm: (reason: string) => void
  loading: boolean; title?: string; desc?: string
}) {
  const [reason, setReason] = useState('')
  useEffect(() => { if (!open) setReason('') }, [open])
  if (!open) return null
  return (
    <div className="cs-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cs-modal">
        <p className="cs-modal-title">{title}</p>
        <p className="cs-modal-desc">{desc}</p>
        <textarea placeholder="사유 입력..." value={reason} onChange={e => setReason(e.target.value)} autoFocus />
        <div className="cs-modal-actions">
          <button className="cs-btn cs-btn-secondary" onClick={onClose} disabled={loading}>취소</button>
          <button
            className="cs-btn cs-btn-primary"
            style={{ background: '#E11D48', color: 'white' }}
            disabled={!reason.trim() || loading}
            onClick={() => onConfirm(reason.trim())}
          >
            {loading ? '처리중...' : '확인'}
          </button>
        </div>
      </div>
    </div>
  )
}
