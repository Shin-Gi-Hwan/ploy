import { useState, useEffect, useCallback } from 'react'
import {
  getReviews, updateReviewVisibility, deleteReview,
  type ConsoleReviewListItem,
} from '../api/consoleApi'
import { Pagination, SearchIcon, useDebounce, formatDate } from '../components/ui/TablePage'

function StarRating({ rating }: { rating: number }) {
  return (
    <span style={{ fontSize: 13, color: '#F59E0B', letterSpacing: 1 }}>
      {'★'.repeat(rating)}{'☆'.repeat(5 - rating)}
    </span>
  )
}

export default function Reviews() {
  const [items, setItems] = useState<ConsoleReviewListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [visibleFilter, setVisibleFilter] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [deleting, setDeleting] = useState<number | null>(null)
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getReviews(page, SIZE, visibleFilter || undefined, debouncedQuery || undefined)
      setItems(res.content); setTotal(res.totalElements); setTotalPages(res.totalPages)
    } finally { setLoading(false) }
  }, [page, visibleFilter, debouncedQuery])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [visibleFilter, debouncedQuery])

  const handleToggleVisible = async (item: ConsoleReviewListItem) => {
    const updated = await updateReviewVisibility(item.id, !item.visible)
    setItems(prev => prev.map(r => r.id === updated.id ? updated : r))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('이 리뷰를 삭제하시겠습니까?')) return
    setDeleting(id)
    try { await deleteReview(id); setItems(prev => prev.filter(r => r.id !== id)) }
    finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">리뷰 관리</h1>
          <p className="cs-page-subtitle">고객 리뷰의 노출 여부를 관리하고 부적절한 리뷰를 삭제합니다.</p>
        </div>
      </div>
      <div className="cs-filter-bar">
        <div className="cs-filter-search">
          <SearchIcon />
          <input placeholder="리뷰어, 프로젝트 검색..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="cs-filter-select" value={visibleFilter} onChange={e => setVisibleFilter(e.target.value)}>
          <option value="">전체 노출</option>
          <option value="true">노출</option>
          <option value="false">숨김</option>
        </select>
      </div>
      <div className="cs-table-wrap">
        {loading ? <div className="cs-loading">불러오는 중...</div>
        : items.length === 0 ? <div className="cs-table-empty">리뷰가 없습니다.</div>
        : (
          <table className="cs-table">
            <thead><tr><th>리뷰어</th><th>프로젝트</th><th>평점</th><th>내용 미리보기</th><th>노출</th><th>작성일</th><th>액션</th></tr></thead>
            <tbody>
              {items.map(r => (
                <tr key={r.id}>
                  <td>
                    <div className="cs-table-name">{r.reviewerName}</div>
                    <div className="cs-table-sub">{r.reviewerEmail ?? '—'}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)', maxWidth: 160 }}>
                    {r.projectTitle ?? '—'}
                  </td>
                  <td><StarRating rating={r.rating} /></td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)', maxWidth: 220 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.contentPreview ?? '—'}
                    </div>
                  </td>
                  <td>
                    <button
                      className={`cs-badge ${r.visible ? 'cs-badge-mint' : 'cs-badge-gray'}`}
                      style={{ cursor: 'pointer', border: 'none' }}
                      onClick={() => handleToggleVisible(r)}
                    >
                      {r.visible ? '노출' : '숨김'}
                    </button>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{formatDate(r.createdAt)}</td>
                  <td>
                    <button className="cs-table-action-btn danger" disabled={deleting === r.id} onClick={() => handleDelete(r.id)}>삭제</button>
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
