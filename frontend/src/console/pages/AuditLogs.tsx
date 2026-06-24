import { useState, useEffect, useCallback } from 'react'
import {
  getAuditLogs,
  type ConsoleAuditLogListItem,
} from '../api/consoleApi'
import { Pagination, SearchIcon, useDebounce, formatDateTime } from '../components/ui/TablePage'

const ACTION_LABELS: Record<string, string> = {
  STATUS_CHANGED: '상태 변경', APPROVED: '승인', REJECTED: '거절',
  ASSIGNED: '배정', NOTE_ADDED: '메모 추가',
  VISIBILITY_CHANGED: '노출 변경', DELETED: '삭제',
  ROLE_CHANGED: '역할 변경', STATUS_TOGGLED: '활성화 변경',
  RETRY: '재시도', SETTING_UPDATED: '설정 변경',
}

const TARGET_LABELS: Record<string, string> = {
  PROJECT: '프로젝트', INQUIRY: '문의', PRODUCT: '상품',
  REVIEW: '리뷰', MEMBER: '회원', PARTNER: '파트너',
  NOTIFICATION: '알림', SETTING: '설정',
}

export default function AuditLogs() {
  const [items, setItems] = useState<ConsoleAuditLogListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [adminQuery, setAdminQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [targetTypeFilter, setTargetTypeFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const debouncedAdmin = useDebounce(adminQuery, 300)
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getAuditLogs(page, SIZE, debouncedAdmin || undefined, actionFilter || undefined, targetTypeFilter || undefined, fromDate || undefined, toDate || undefined)
      setItems(res.content); setTotal(res.totalElements); setTotalPages(res.totalPages)
    } finally { setLoading(false) }
  }, [page, actionFilter, targetTypeFilter, fromDate, toDate, debouncedAdmin])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [actionFilter, targetTypeFilter, fromDate, toDate, debouncedAdmin])

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">감사 로그</h1>
          <p className="cs-page-subtitle">관리자의 모든 액션 이력을 기록하고 조회합니다.</p>
        </div>
      </div>
      <div className="cs-filter-bar" style={{ flexWrap: 'wrap' }}>
        <div className="cs-filter-search" style={{ minWidth: 160 }}>
          <SearchIcon />
          <input placeholder="관리자 이메일..." value={adminQuery} onChange={e => setAdminQuery(e.target.value)} />
        </div>
        <select className="cs-filter-select" value={actionFilter} onChange={e => setActionFilter(e.target.value)}>
          <option value="">전체 액션</option>
          {Object.entries(ACTION_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select className="cs-filter-select" value={targetTypeFilter} onChange={e => setTargetTypeFilter(e.target.value)}>
          <option value="">전체 대상</option>
          {Object.entries(TARGET_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <input type="date" className="cs-filter-select" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ minWidth: 130 }} />
        <input type="date" className="cs-filter-select" value={toDate} onChange={e => setToDate(e.target.value)} style={{ minWidth: 130 }} />
        {(fromDate || toDate || actionFilter || targetTypeFilter || adminQuery) && (
          <button className="cs-btn cs-btn-secondary" style={{ fontSize: 12 }} onClick={() => { setAdminQuery(''); setActionFilter(''); setTargetTypeFilter(''); setFromDate(''); setToDate('') }}>
            필터 초기화
          </button>
        )}
      </div>
      <div className="cs-table-wrap">
        {loading ? <div className="cs-loading">불러오는 중...</div>
        : items.length === 0 ? <div className="cs-table-empty">감사 로그가 없습니다.</div>
        : (
          <table className="cs-table">
            <thead><tr><th>관리자</th><th>액션</th><th>대상</th><th>IP</th><th>일시</th><th>변경내역</th></tr></thead>
            <tbody>
              {items.map(log => (
                <>
                  <tr key={log.id}>
                    <td>
                      <div className="cs-table-name mono" style={{ fontSize: 12 }}>{log.adminEmail ?? '—'}</div>
                    </td>
                    <td>
                      <span className="cs-badge cs-badge-blue" style={{ fontSize: 11 }}>
                        {ACTION_LABELS[log.actionType] ?? log.actionType}
                      </span>
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>
                      {log.targetType ? (TARGET_LABELS[log.targetType] ?? log.targetType) : '—'}
                      {log.targetId ? <span style={{ color: 'var(--cs-text-3)', marginLeft: 4 }}>#{log.targetId}</span> : null}
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--cs-text-3)', fontFamily: 'monospace' }}>{log.ipAddress ?? '—'}</td>
                    <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{formatDateTime(log.createdAt)}</td>
                    <td>
                      {(log.beforeValue || log.afterValue) && (
                        <button className="cs-table-action-btn" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}>
                          {expandedId === log.id ? '접기' : '보기'}
                        </button>
                      )}
                    </td>
                  </tr>
                  {expandedId === log.id && (log.beforeValue || log.afterValue) && (
                    <tr key={`${log.id}-detail`}>
                      <td colSpan={6} style={{ padding: '0 16px 12px', background: 'var(--cs-bg)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 8 }}>
                          <div>
                            <p style={{ fontSize: 11, color: 'var(--cs-text-3)', marginBottom: 4, fontWeight: 600 }}>변경 전</p>
                            <pre style={{ fontSize: 12, color: 'var(--cs-text-2)', background: 'var(--cs-surface)', padding: 10, borderRadius: 6, overflow: 'auto', margin: 0 }}>
                              {log.beforeValue ?? '—'}
                            </pre>
                          </div>
                          <div>
                            <p style={{ fontSize: 11, color: 'var(--cs-text-3)', marginBottom: 4, fontWeight: 600 }}>변경 후</p>
                            <pre style={{ fontSize: 12, color: 'var(--cs-text-2)', background: 'var(--cs-surface)', padding: 10, borderRadius: 6, overflow: 'auto', margin: 0 }}>
                              {log.afterValue ?? '—'}
                            </pre>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
        {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} totalElements={total} size={SIZE} onChange={setPage} />}
      </div>
    </div>
  )
}
