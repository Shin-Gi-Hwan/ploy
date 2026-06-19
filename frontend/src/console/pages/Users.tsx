import { useState, useEffect, useCallback } from 'react'
import {
  getUsers, getUserDetail, updateUserRole, updateUserStatus,
  type MemberListItem, type MemberDetail, type UserRole,
} from '../api/consoleApi'
import Drawer from '../components/ui/Drawer'

// ─── Helpers ────────────────────────────────────────────────────────────────────

const ROLE_LABELS: Record<string, string> = {
  USER: '일반회원',
  OUTSOURCING_PARTNER: '파트너',
  ADMIN: '어드민',
}

const ROLE_CLASS: Record<string, string> = {
  USER: 'cs-badge-gray',
  OUTSOURCING_PARTNER: 'cs-badge-mint',
  ADMIN: 'cs-badge-blue',
}

function formatDate(iso: string) {
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

// ─── Pagination ──────────────────────────────────────────────────────────────────

function Pagination({
  page, totalPages, totalElements, size, onChange,
}: { page: number; totalPages: number; totalElements: number; size: number; onChange: (p: number) => void }) {
  const start = page * size + 1
  const end = Math.min((page + 1) * size, totalElements)

  const pages: number[] = []
  const delta = 2
  for (let i = Math.max(0, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
    pages.push(i)
  }

  return (
    <div className="cs-pagination">
      <span className="cs-pagination-info">
        {totalElements === 0 ? '결과 없음' : `${start}–${end} / ${totalElements}명`}
      </span>
      <div className="cs-pagination-btns">
        <button className="cs-page-btn" disabled={page === 0} onClick={() => onChange(0)}>{'«'}</button>
        <button className="cs-page-btn" disabled={page === 0} onClick={() => onChange(page - 1)}>{'‹'}</button>
        {pages.map(p => (
          <button key={p} className={`cs-page-btn${p === page ? ' active' : ''}`} onClick={() => onChange(p)}>
            {p + 1}
          </button>
        ))}
        <button className="cs-page-btn" disabled={page >= totalPages - 1} onClick={() => onChange(page + 1)}>{'›'}</button>
        <button className="cs-page-btn" disabled={page >= totalPages - 1} onClick={() => onChange(totalPages - 1)}>{'»'}</button>
      </div>
    </div>
  )
}

// ─── User Drawer ─────────────────────────────────────────────────────────────────

function UserDrawer({
  userId,
  onClose,
  onUpdated,
}: {
  userId: number | null
  onClose: () => void
  onUpdated: (item: MemberListItem) => void
}) {
  const [detail, setDetail] = useState<MemberDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!userId) { setDetail(null); return }
    setLoading(true)
    getUserDetail(userId)
      .then(setDetail)
      .finally(() => setLoading(false))
  }, [userId])

  const handleRoleChange = async (role: UserRole) => {
    if (!detail) return
    setSaving(true)
    try {
      const updated = await updateUserRole(detail.id, role)
      setDetail(d => d ? { ...d, role: updated.role } : d)
      onUpdated(updated)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async () => {
    if (!detail) return
    setSaving(true)
    try {
      const updated = await updateUserStatus(detail.id, !detail.active)
      setDetail(d => d ? { ...d, active: updated.active } : d)
      onUpdated(updated)
    } finally {
      setSaving(false)
    }
  }

  const PROJECT_STATUS_LABELS: Record<string, string> = {
    REQUESTED: '요청됨', BRIEF_SUBMITTED: '브리프제출', REVIEWING: '검토중',
    APPROVED: '승인됨', REJECTED: '거절됨', ASSIGNED: '배정됨',
    IN_PROGRESS: '진행중', REVIEW: '검수중', DELIVERED: '납품됨', COMPLETED: '완료',
  }

  return (
    <Drawer open={!!userId} onClose={onClose} title="회원 상세">
      {loading && <div className="cs-loading">불러오는 중...</div>}
      {!loading && detail && (
        <>
          {/* Profile */}
          <div className="cs-detail-section">
            <p className="cs-detail-section-title">기본 정보</p>
            <div className="cs-detail-field">
              <span className="cs-detail-label">이름</span>
              <span className="cs-detail-value">{detail.name}</span>
            </div>
            <div className="cs-detail-field">
              <span className="cs-detail-label">이메일</span>
              <span className="cs-detail-value mono">{detail.email}</span>
            </div>
            <div className="cs-detail-field">
              <span className="cs-detail-label">가입일</span>
              <span className="cs-detail-value">{formatDate(detail.createdAt)}</span>
            </div>
            <div className="cs-detail-field">
              <span className="cs-detail-label">ID</span>
              <span className="cs-detail-value mono">#{detail.id}</span>
            </div>
          </div>

          {/* Role & Status */}
          <div className="cs-detail-section">
            <p className="cs-detail-section-title">권한 / 상태</p>
            <div className="cs-detail-field">
              <span className="cs-detail-label">역할</span>
              <select
                className="cs-role-select"
                value={detail.role}
                disabled={saving}
                onChange={e => handleRoleChange(e.target.value as UserRole)}
              >
                <option value="USER">일반회원</option>
                <option value="OUTSOURCING_PARTNER">파트너</option>
                <option value="ADMIN">어드민</option>
              </select>
            </div>
            <div className="cs-detail-field">
              <span className="cs-detail-label">계정 활성</span>
              <label className="cs-toggle">
                <input
                  type="checkbox"
                  checked={detail.active}
                  disabled={saving}
                  onChange={handleToggleActive}
                />
                <span className="cs-toggle-slider" />
              </label>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="cs-detail-section">
            <p className="cs-detail-section-title">최근 프로젝트</p>
            {detail.recentProjects.length === 0
              ? <p style={{ fontSize: 13, color: 'var(--cs-text-3)' }}>프로젝트 없음</p>
              : (
                <div className="cs-mini-list">
                  {detail.recentProjects.map(p => (
                    <div key={p.id} className="cs-mini-list-item">
                      <div>
                        <div className="name">{p.title}</div>
                        <div className="sub">{p.type} · {formatDate(p.createdAt)}</div>
                      </div>
                      <span className={`cs-badge ${
                        p.status === 'COMPLETED' || p.status === 'DELIVERED' ? 'cs-badge-mint'
                        : p.status === 'REJECTED' ? 'cs-badge-red'
                        : p.status === 'IN_PROGRESS' || p.status === 'REVIEW' ? 'cs-badge-blue'
                        : 'cs-badge-amber'
                      }`}>
                        {PROJECT_STATUS_LABELS[p.status] ?? p.status}
                      </span>
                    </div>
                  ))}
                </div>
              )
            }
          </div>
        </>
      )}
    </Drawer>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────────

export default function Users() {
  const [items, setItems] = useState<MemberListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  const [query, setQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [activeFilter, setActiveFilter] = useState('')

  const debouncedQuery = useDebounce(query, 300)

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getUsers(page, SIZE, roleFilter || undefined, activeFilter || undefined, debouncedQuery || undefined)
      setItems(res.content)
      setTotal(res.totalElements)
      setTotalPages(res.totalPages)
    } finally {
      setLoading(false)
    }
  }, [page, roleFilter, activeFilter, debouncedQuery])

  useEffect(() => { load() }, [load])

  // Reset to page 0 when filters change
  useEffect(() => { setPage(0) }, [roleFilter, activeFilter, debouncedQuery])

  const handleUpdated = (updated: MemberListItem) => {
    setItems(prev => prev.map(m => m.id === updated.id ? updated : m))
  }

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">회원 관리</h1>
          <p className="cs-page-subtitle">전체 회원 목록을 조회하고 역할 및 상태를 관리합니다.</p>
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
        <select className="cs-filter-select" value={roleFilter} onChange={e => setRoleFilter(e.target.value)}>
          <option value="">전체 역할</option>
          <option value="USER">일반회원</option>
          <option value="OUTSOURCING_PARTNER">파트너</option>
          <option value="ADMIN">어드민</option>
        </select>
        <select className="cs-filter-select" value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="true">활성</option>
          <option value="false">비활성</option>
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
                <th>역할</th>
                <th>상태</th>
                <th>가입일</th>
              </tr>
            </thead>
            <tbody>
              {items.map(m => (
                <tr key={m.id} onClick={() => setSelectedId(m.id)}>
                  <td>
                    <div className="cs-table-name">{m.name}</div>
                    <div className="cs-table-sub">{m.email}</div>
                  </td>
                  <td>
                    <span className={`cs-badge ${ROLE_CLASS[m.role] ?? 'cs-badge-gray'}`}>
                      {ROLE_LABELS[m.role] ?? m.role}
                    </span>
                  </td>
                  <td>
                    <span className={`cs-badge ${m.active ? 'cs-badge-mint' : 'cs-badge-gray'}`}>
                      {m.active ? '활성' : '비활성'}
                    </span>
                  </td>
                  <td style={{ color: 'var(--cs-text-2)', fontSize: 13 }}>{formatDate(m.createdAt)}</td>
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
      <UserDrawer
        userId={selectedId}
        onClose={() => setSelectedId(null)}
        onUpdated={handleUpdated}
      />
    </div>
  )
}
