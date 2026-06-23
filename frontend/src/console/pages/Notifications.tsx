import { useState, useEffect, useCallback } from 'react'
import {
  getNotifications, retryNotification,
  type ConsoleNotificationListItem,
} from '../api/consoleApi'
import { Pagination, formatDateTime } from '../components/ui/TablePage'

const EVENT_LABELS: Record<string, string> = {
  INQUIRY_SUBMITTED: '문의 접수', INQUIRY_APPROVED: '문의 승인', INQUIRY_REJECTED: '문의 거절',
  DRAFT_UPLOADED: '시안 업로드', REVISION_REQUESTED: '수정 요청',
  FINAL_DELIVERY_UPLOADED: '최종 납품', PROJECT_COMPLETED: '프로젝트 완료',
  PARTNER_APPROVED: '파트너 승인', PARTNER_REJECTED: '파트너 거절',
  MEMBER_REGISTERED: '회원 가입',
}
const ALL_EVENTS = Object.keys(EVENT_LABELS)

const STATUS_CLASS: Record<string, string> = {
  SENT: 'cs-badge-mint', FAILED: 'cs-badge-red', PENDING: 'cs-badge-amber',
}
const STATUS_LABELS: Record<string, string> = {
  SENT: '발송됨', FAILED: '실패', PENDING: '대기중',
}

export default function Notifications() {
  const [items, setItems] = useState<ConsoleNotificationListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [retrying, setRetrying] = useState<number | null>(null)
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getNotifications(page, SIZE, typeFilter || undefined, statusFilter || undefined)
      setItems(res.content); setTotal(res.totalElements); setTotalPages(res.totalPages)
    } finally { setLoading(false) }
  }, [page, typeFilter, statusFilter])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [typeFilter, statusFilter])

  const handleRetry = async (id: number) => {
    setRetrying(id)
    try {
      const updated = await retryNotification(id)
      setItems(prev => prev.map(n => n.id === updated.id ? updated : n))
    } finally { setRetrying(null) }
  }

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">알림 관리</h1>
          <p className="cs-page-subtitle">시스템 알림 발송 이력을 조회하고 실패 알림을 재시도합니다.</p>
        </div>
      </div>
      <div className="cs-filter-bar">
        <select className="cs-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">전체 이벤트</option>
          {ALL_EVENTS.map(e => <option key={e} value={e}>{EVENT_LABELS[e]}</option>)}
        </select>
        <select className="cs-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="PENDING">대기중</option>
          <option value="SENT">발송됨</option>
          <option value="FAILED">실패</option>
        </select>
      </div>
      <div className="cs-table-wrap">
        {loading ? <div className="cs-loading">불러오는 중...</div>
        : items.length === 0 ? <div className="cs-table-empty">알림 이력이 없습니다.</div>
        : (
          <table className="cs-table">
            <thead><tr><th>이벤트</th><th>상태</th><th>수신자</th><th>제목</th><th>재시도</th><th>발송일시</th><th>액션</th></tr></thead>
            <tbody>
              {items.map(n => (
                <tr key={n.id}>
                  <td><span className="cs-badge cs-badge-gray" style={{ fontSize: 11 }}>{EVENT_LABELS[n.eventType] ?? n.eventType}</span></td>
                  <td><span className={`cs-badge ${STATUS_CLASS[n.status] ?? 'cs-badge-gray'}`}>{STATUS_LABELS[n.status] ?? n.status}</span></td>
                  <td>
                    <div className="cs-table-name mono" style={{ fontSize: 13 }}>{n.recipientEmail}</div>
                    {n.recipientName && <div className="cs-table-sub">{n.recipientName}</div>}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)', maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.subject ?? '—'}</div>
                    {n.errorMessage && <div className="cs-table-sub" style={{ color: '#E11D48' }}>{n.errorMessage}</div>}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{n.retryCount}회</td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{formatDateTime(n.sentAt ?? n.createdAt)}</td>
                  <td>
                    {n.status === 'FAILED' && (
                      <button className="cs-table-action-btn success" disabled={retrying === n.id} onClick={() => handleRetry(n.id)}>
                        {retrying === n.id ? '...' : '재시도'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} totalElements={total} size={SIZE} onChange={setPage} />}
      </div>
    </div>
  )
}
