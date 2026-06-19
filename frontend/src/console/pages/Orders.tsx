import { useState, useEffect, useCallback } from 'react'
import { getOrders, getOrderDetail, type ConsoleOrderListItem, type ConsoleOrderDetail } from '../api/consoleApi'
import Drawer from '../components/ui/Drawer'

// ─── Helpers ────────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  PENDING: '대기중', PAID: '결제완료', PREPARING: '준비중',
  SHIPPED: '배송중', DELIVERED: '배송완료', COMPLETED: '완료',
  CANCELLED: '취소됨', REFUND_REQUESTED: '환불요청', REFUNDED: '환불완료', FAILED: '실패',
}
const STATUS_CLASS: Record<string, string> = {
  PENDING: 'cs-badge-amber', PAID: 'cs-badge-blue', PREPARING: 'cs-badge-blue',
  SHIPPED: 'cs-badge-blue', DELIVERED: 'cs-badge-mint', COMPLETED: 'cs-badge-mint',
  CANCELLED: 'cs-badge-red', REFUND_REQUESTED: 'cs-badge-amber',
  REFUNDED: 'cs-badge-gray', FAILED: 'cs-badge-red',
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  PRODUCT: '상품',
  SERVICE: '서비스',
  PROJECT_EXTRA_REVISION: '추가 수정',
}

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

function formatKRW(amount: number | null) {
  if (amount == null) return '—'
  return new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(amount)
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

// ─── Order Drawer ────────────────────────────────────────────────────────────────

function OrderDrawer({ orderId, onClose }: { orderId: number | null; onClose: () => void }) {
  const [detail, setDetail] = useState<ConsoleOrderDetail | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!orderId) { setDetail(null); return }
    setLoading(true)
    getOrderDetail(orderId).then(setDetail).finally(() => setLoading(false))
  }, [orderId])

  return (
    <Drawer open={!!orderId} onClose={onClose} title="주문 상세" width={520}>
      {loading && <div className="cs-loading">불러오는 중...</div>}
      {!loading && detail && (
        <>
          {/* Status */}
          <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className={`cs-badge ${STATUS_CLASS[detail.status] ?? 'cs-badge-gray'}`} style={{ fontSize: 13, padding: '4px 12px' }}>
              {STATUS_LABELS[detail.status] ?? detail.status}
            </span>
            <span style={{ fontSize: 12, color: 'var(--cs-text-3)', fontFamily: 'monospace' }}>
              #{detail.orderNo}
            </span>
          </div>

          {/* Order info */}
          <div className="cs-detail-section">
            <p className="cs-detail-section-title">주문 정보</p>
            <div className="cs-detail-field">
              <span className="cs-detail-label">주문 유형</span>
              <span className="cs-detail-value">{ORDER_TYPE_LABELS[detail.orderType] ?? detail.orderType}</span>
            </div>
            <div className="cs-detail-field">
              <span className="cs-detail-label">주문일</span>
              <span className="cs-detail-value">{formatDate(detail.createdAt)}</span>
            </div>
            <div className="cs-detail-field">
              <span className="cs-detail-label">상품 금액</span>
              <span className="cs-detail-value">{formatKRW(detail.totalProductAmount)}</span>
            </div>
            {detail.deliveryFee > 0 && (
              <div className="cs-detail-field">
                <span className="cs-detail-label">배송비</span>
                <span className="cs-detail-value">{formatKRW(detail.deliveryFee)}</span>
              </div>
            )}
            {detail.discountAmount > 0 && (
              <div className="cs-detail-field">
                <span className="cs-detail-label">할인</span>
                <span className="cs-detail-value" style={{ color: '#E11D48' }}>-{formatKRW(detail.discountAmount)}</span>
              </div>
            )}
            <div className="cs-detail-field">
              <span className="cs-detail-label">총 결제</span>
              <span className="cs-detail-value" style={{ fontWeight: 700, fontSize: 15 }}>{formatKRW(detail.totalPaymentAmount)}</span>
            </div>
          </div>

          {/* Buyer */}
          <div className="cs-detail-section">
            <p className="cs-detail-section-title">구매자</p>
            <div className="cs-detail-field">
              <span className="cs-detail-label">이름</span>
              <span className="cs-detail-value">{detail.buyerName ?? '—'}</span>
            </div>
            <div className="cs-detail-field">
              <span className="cs-detail-label">이메일</span>
              <span className="cs-detail-value mono">{detail.buyerEmail ?? '—'}</span>
            </div>
            {detail.buyerPhone && (
              <div className="cs-detail-field">
                <span className="cs-detail-label">연락처</span>
                <span className="cs-detail-value">{detail.buyerPhone}</span>
              </div>
            )}
            <div className="cs-detail-field">
              <span className="cs-detail-label">유형</span>
              <span className="cs-detail-value">{detail.isGuest ? '비회원' : '회원'}</span>
            </div>
          </div>

          {/* Delivery */}
          {(detail.receiverName || detail.address1) && (
            <div className="cs-detail-section">
              <p className="cs-detail-section-title">배송 정보</p>
              {detail.receiverName && (
                <div className="cs-detail-field">
                  <span className="cs-detail-label">수령인</span>
                  <span className="cs-detail-value">{detail.receiverName} {detail.receiverPhone ?? ''}</span>
                </div>
              )}
              {detail.address1 && (
                <div className="cs-detail-field">
                  <span className="cs-detail-label">주소</span>
                  <span className="cs-detail-value" style={{ textAlign: 'right' }}>
                    [{detail.postalCode}] {detail.address1} {detail.address2 ?? ''}
                  </span>
                </div>
              )}
              {detail.deliveryMemo && (
                <div className="cs-detail-field">
                  <span className="cs-detail-label">배송 메모</span>
                  <span className="cs-detail-value">{detail.deliveryMemo}</span>
                </div>
              )}
            </div>
          )}

          {/* Items */}
          {detail.items.length > 0 && (
            <div className="cs-detail-section">
              <p className="cs-detail-section-title">주문 항목</p>
              <div className="cs-mini-list">
                {detail.items.map(item => (
                  <div key={item.id} className="cs-mini-list-item">
                    <div>
                      <div className="name">{item.itemName}</div>
                      <div className="sub">{item.itemType} · {item.quantity}개 × {formatKRW(item.unitPrice)}</div>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--cs-text-1)' }}>
                      {formatKRW(item.totalPrice)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments */}
          {detail.payments.length > 0 && (
            <div className="cs-detail-section">
              <p className="cs-detail-section-title">결제 내역</p>
              {detail.payments.map(pay => (
                <div key={pay.id} style={{ background: 'var(--cs-bg)', borderRadius: 'var(--cs-radius-sm)', padding: '10px 12px', marginBottom: 8, border: '1px solid var(--cs-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--cs-text-1)' }}>
                      {pay.provider} {pay.method ? `· ${pay.method}` : ''}
                    </span>
                    <span className={`cs-badge ${pay.status === 'APPROVED' ? 'cs-badge-mint' : pay.status === 'CANCELLED' ? 'cs-badge-red' : 'cs-badge-amber'}`}>
                      {pay.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--cs-text-2)' }}>
                    요청: {formatKRW(pay.requestedAmount)}
                    {pay.approvedAmount != null && ` · 승인: ${formatKRW(pay.approvedAmount)}`}
                    {pay.cancelledAmount != null && pay.cancelledAmount > 0 && ` · 취소: ${formatKRW(pay.cancelledAmount)}`}
                  </div>
                  {pay.approvedAt && (
                    <div style={{ fontSize: 11.5, color: 'var(--cs-text-3)', marginTop: 2 }}>
                      승인일: {formatDate(pay.approvedAt)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Drawer>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────────

export default function Orders() {
  const [items, setItems] = useState<ConsoleOrderListItem[]>([])
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
      const res = await getOrders(page, SIZE, statusFilter || undefined, debouncedQuery || undefined)
      setItems(res.content)
      setTotal(res.totalElements)
      setTotalPages(res.totalPages)
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, debouncedQuery])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [statusFilter, debouncedQuery])

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">주문 관리</h1>
          <p className="cs-page-subtitle">상품 주문 목록을 조회하고 결제 및 배송 상태를 확인합니다.</p>
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
            placeholder="주문번호, 구매자 이름 / 이메일 검색..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <select className="cs-filter-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="">전체 상태</option>
          <option value="PENDING">대기중</option>
          <option value="PAID">결제완료</option>
          <option value="PREPARING">준비중</option>
          <option value="SHIPPED">배송중</option>
          <option value="DELIVERED">배송완료</option>
          <option value="COMPLETED">완료</option>
          <option value="CANCELLED">취소됨</option>
          <option value="REFUND_REQUESTED">환불요청</option>
          <option value="REFUNDED">환불완료</option>
          <option value="FAILED">실패</option>
        </select>
      </div>

      {/* Table */}
      <div className="cs-table-wrap">
        {loading ? (
          <div className="cs-loading">불러오는 중...</div>
        ) : items.length === 0 ? (
          <div className="cs-table-empty">주문이 없습니다.</div>
        ) : (
          <table className="cs-table">
            <thead>
              <tr>
                <th>주문번호</th>
                <th>구매자</th>
                <th>유형</th>
                <th>상태</th>
                <th>금액</th>
                <th>주문일</th>
              </tr>
            </thead>
            <tbody>
              {items.map(o => (
                <tr key={o.id} onClick={() => setSelectedId(o.id)}>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: 12.5, color: 'var(--cs-text-2)' }}>
                      {o.orderNo}
                    </span>
                  </td>
                  <td>
                    <div className="cs-table-name">{o.buyerName ?? '비회원'}</div>
                    <div className="cs-table-sub">{o.buyerEmail ?? '—'}</div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>
                    {ORDER_TYPE_LABELS[o.orderType] ?? o.orderType}
                  </td>
                  <td>
                    <span className={`cs-badge ${STATUS_CLASS[o.status] ?? 'cs-badge-gray'}`}>
                      {STATUS_LABELS[o.status] ?? o.status}
                    </span>
                  </td>
                  <td style={{ fontSize: 13, fontWeight: 500, color: 'var(--cs-text-1)' }}>
                    {formatKRW(o.totalPaymentAmount)}
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{formatDate(o.createdAt)}</td>
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
      <OrderDrawer
        orderId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  )
}
