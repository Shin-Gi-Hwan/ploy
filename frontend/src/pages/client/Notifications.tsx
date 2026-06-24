import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'

interface NotificationItem {
  id: number
  eventType: string
  recipientEmail: string
  subject: string | null
  status: string
  retryCount: number
  sentAt: string | null
  createdAt: string
}

interface PageResponse<T> { content: T[]; totalElements: number; totalPages: number; number: number }

const EVENT_LABELS: Record<string, string> = {
  INQUIRY_SUBMITTED: '문의 접수', INQUIRY_APPROVED: '문의 승인', INQUIRY_REJECTED: '문의 거절',
  DRAFT_UPLOADED: '시안 업로드', REVISION_REQUESTED: '수정 요청',
  FINAL_DELIVERY_UPLOADED: '최종 납품', PROJECT_COMPLETED: '프로젝트 완료',
  PARTNER_APPROVED: '파트너 승인', PARTNER_REJECTED: '파트너 거절',
  MEMBER_REGISTERED: '회원 가입',
}

const STATUS_COLOR: Record<string, string> = {
  SENT: '#10b981', FAILED: '#e11d48', PENDING: '#f59e0b',
}

function formatDateTime(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function ClientNotifications() {
  useAuth()
  const token = localStorage.getItem('ploy_token')
  const [items, setItems] = useState<NotificationItem[]>([])
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get<PageResponse<NotificationItem>>('/api/notifications/my', {
        headers: { Authorization: `Bearer ${token}` },
        params: { page, size: SIZE },
      })
      setItems(res.data.content)
      setTotalPages(res.data.totalPages)
    } finally { setLoading(false) }
  }, [page, token])

  useEffect(() => { load() }, [load])

  return (
    <Layout>
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: '#1a2e1a', margin: '0 0 6px' }}>알림</h1>
          <p style={{ fontSize: 14, color: '#6b7b6b', margin: 0 }}>나에게 발송된 이메일 알림 이력입니다.</p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca39c' }}>불러오는 중...</div>
        ) : items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9ca39c' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔔</div>
            <p style={{ margin: 0, fontSize: 14 }}>알림이 없습니다.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {items.map(n => (
              <div key={n.id} style={{ background: '#fff', border: '1px solid #e4e9e4', borderRadius: 12, padding: '16px 20px', display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                {/* Icon */}
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                  🔔
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: '#1a2e1a' }}>
                      {EVENT_LABELS[n.eventType] ?? n.eventType}
                    </span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: STATUS_COLOR[n.status] ?? '#d1d5db', flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: STATUS_COLOR[n.status] ?? '#9ca39c' }}>
                      {n.status === 'SENT' ? '발송됨' : n.status === 'FAILED' ? '실패' : '대기중'}
                    </span>
                  </div>
                  {n.subject && (
                    <p style={{ fontSize: 14, color: '#4b5b4b', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {n.subject}
                    </p>
                  )}
                  <span style={{ fontSize: 12, color: '#9ca39c' }}>{formatDateTime(n.sentAt ?? n.createdAt)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32 }}>
            <button disabled={page === 0} onClick={() => setPage(p => p - 1)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e4e9e4', background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', color: '#4b5b4b', fontSize: 13 }}>이전</button>
            <span style={{ padding: '6px 14px', fontSize: 13, color: '#6b7b6b' }}>{page + 1} / {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)} style={{ padding: '6px 14px', borderRadius: 8, border: '1px solid #e4e9e4', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', color: '#4b5b4b', fontSize: 13 }}>다음</button>
          </div>
        )}
      </div>
    </Layout>
  )
}
