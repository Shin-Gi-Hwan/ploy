import { useState, useEffect, useCallback, useRef } from 'react'
import {
  getChatRooms, getChatMessages,
  type ConsoleChatRoomListItem, type ConsoleChatMessageItem,
} from '../api/consoleApi'
import { Pagination, SearchIcon, useDebounce, formatDate, formatDateTime } from '../components/ui/TablePage'

function MessagePanel({ room, onClose }: { room: ConsoleChatRoomListItem; onClose: () => void }) {
  const [messages, setMessages] = useState<ConsoleChatMessageItem[]>([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(true)
    getChatMessages(room.id, page, 50)
      .then(res => { setMessages(res.content); setTotalPages(res.totalPages) })
      .finally(() => setLoading(false))
  }, [room.id, page])

  useEffect(() => {
    if (page === 0) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, page])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end',
      pointerEvents: 'none',
    }}>
      <div style={{
        width: 420, height: '100vh', background: 'var(--cs-surface)', borderLeft: '1px solid var(--cs-border)',
        display: 'flex', flexDirection: 'column', pointerEvents: 'all',
      }}>
        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--cs-border)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cs-text-2)', fontSize: 18, lineHeight: 1, padding: 0 }}>←</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--cs-text-1)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {room.projectTitle}
            </div>
            <div style={{ fontSize: 12, color: 'var(--cs-text-3)' }}>{room.ownerName} · 읽기 전용</div>
          </div>
        </div>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading && <div style={{ textAlign: 'center', color: 'var(--cs-text-3)', fontSize: 13 }}>불러오는 중...</div>}
          {!loading && messages.length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--cs-text-3)', fontSize: 13, marginTop: 40 }}>메시지가 없습니다.</div>
          )}
          {messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--cs-text-1)' }}>{m.senderName}</span>
                <span style={{ fontSize: 11, color: 'var(--cs-text-3)' }}>{formatDateTime(m.createdAt)}</span>
              </div>
              {m.content && (
                <div style={{ fontSize: 13, color: 'var(--cs-text-2)', lineHeight: 1.55, background: 'var(--cs-bg)', padding: '8px 12px', borderRadius: 8, maxWidth: '90%', wordBreak: 'break-word' }}>
                  {m.content}
                </div>
              )}
              {m.attachmentUrl && (
                <a href={m.attachmentUrl} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--cs-accent)', textDecoration: 'none' }}>
                  📎 첨부파일
                </a>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ padding: '8px 20px', borderTop: '1px solid var(--cs-border)', display: 'flex', gap: 8, justifyContent: 'center' }}>
            <button className="cs-page-btn" disabled={page === 0} onClick={() => setPage(p => p - 1)}>‹ 이전</button>
            <span style={{ fontSize: 12, color: 'var(--cs-text-3)', padding: '4px 8px' }}>{page + 1} / {totalPages}</span>
            <button className="cs-page-btn" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>다음 ›</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ChatMonitor() {
  const [rooms, setRooms] = useState<ConsoleChatRoomListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [selectedRoom, setSelectedRoom] = useState<ConsoleChatRoomListItem | null>(null)
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getChatRooms(page, SIZE, debouncedQuery || undefined)
      setRooms(res.content); setTotal(res.totalElements); setTotalPages(res.totalPages)
    } finally { setLoading(false) }
  }, [page, debouncedQuery])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [debouncedQuery])

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">채팅 모니터</h1>
          <p className="cs-page-subtitle">프로젝트별 채팅 내역을 읽기 전용으로 모니터링합니다.</p>
        </div>
      </div>
      <div className="cs-filter-bar">
        <div className="cs-filter-search">
          <SearchIcon />
          <input placeholder="프로젝트, 의뢰인 검색..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
      </div>
      <div className="cs-table-wrap">
        {loading ? <div className="cs-loading">불러오는 중...</div>
        : rooms.length === 0 ? <div className="cs-table-empty">채팅방이 없습니다.</div>
        : (
          <table className="cs-table">
            <thead><tr><th>프로젝트</th><th>의뢰인</th><th>메시지 수</th><th>개설일</th></tr></thead>
            <tbody>
              {rooms.map(r => (
                <tr key={r.id} onClick={() => setSelectedRoom(r)} style={{ cursor: 'pointer' }}>
                  <td><div className="cs-table-name">{r.projectTitle}</div></td>
                  <td>
                    <div className="cs-table-name">{r.ownerName}</div>
                    <div className="cs-table-sub">{r.ownerEmail ?? '—'}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{r.messageCount.toLocaleString()}개</td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{formatDate(r.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} totalElements={total} size={SIZE} onChange={setPage} />}
      </div>
      {selectedRoom && <MessagePanel room={selectedRoom} onClose={() => setSelectedRoom(null)} />}
    </div>
  )
}
