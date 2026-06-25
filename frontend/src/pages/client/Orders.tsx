import { useState, useEffect } from 'react'
import DashboardLayout from '../../components/layout/DashboardLayout'
import Spinner from '../../components/ui/Spinner'
import Badge from '../../components/ui/Badge'
import { getMyOrders } from '../../lib/api'
import type { ClientOrder } from '../../lib/api'

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: '결제 대기', PAID: '결제 완료', CANCELLED: '취소',
  REFUNDED: '환불', FAILED: '결제 실패',
}

const ORDER_TYPE_LABELS: Record<string, string> = {
  PRODUCT: '상품 구매', SERVICE: '서비스 신청', SUBSCRIPTION: '구독',
}

function statusVariant(s: string): 'default' | 'info' | 'success' | 'warning' | 'error' {
  if (s === 'PAID') return 'success'
  if (s === 'PENDING') return 'warning'
  if (['CANCELLED', 'REFUNDED', 'FAILED'].includes(s)) return 'error'
  return 'default'
}

function formatPrice(amount: number) {
  return amount.toLocaleString('ko-KR') + '원'
}

export default function ClientOrders() {
  const [orders, setOrders] = useState<ClientOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    getMyOrders()
      .then(setOrders)
      .catch(() => setError('주문 내역을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <DashboardLayout title="주문 내역">
      <div className="client-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>총 {orders.length}건</span>
        </div>

        {loading && <div className="client-loading"><Spinner /></div>}
        {error && <div className="client-error">{error}</div>}

        {!loading && !error && orders.length === 0 && (
          <div className="client-empty">
            <p className="client-empty-text">아직 주문 내역이 없습니다.</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map(order => (
              <div
                key={order.id}
                style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, overflow: 'hidden' }}
              >
                {/* Order header */}
                <button
                  onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                  style={{
                    width: '100%', textAlign: 'left', padding: '14px 18px',
                    display: 'flex', alignItems: 'center', gap: 12, background: 'none',
                    border: 'none', cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 20, flexShrink: 0 }}>🛍</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>
                      {order.orderNo}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>
                      {ORDER_TYPE_LABELS[order.orderType] ?? order.orderType}
                      &nbsp;·&nbsp;{new Date(order.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                      {formatPrice(order.totalPaymentAmount)}
                    </span>
                    <Badge variant={statusVariant(order.status)}>
                      {ORDER_STATUS_LABELS[order.status] ?? order.status}
                    </Badge>
                    <span style={{ fontSize: 16, color: 'var(--text-tertiary)', transform: expanded === order.id ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s' }}>›</span>
                  </div>
                </button>

                {/* Order items */}
                {expanded === order.id && (
                  <div style={{ borderTop: '1px solid var(--border-default)', padding: '12px 18px', background: '#fafafa' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: 8 }}>주문 상품</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {order.items.map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>
                            {item.productName}
                            {item.quantity > 1 && <span style={{ color: 'var(--text-tertiary)' }}> × {item.quantity}</span>}
                          </span>
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderTop: '1px solid var(--border-default)', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>합계</span>
                      <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--mint-700)' }}>{formatPrice(order.totalPaymentAmount)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
