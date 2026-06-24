import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import Layout from '../components/layout/Layout'
import { useAuth } from '../context/AuthContext'

interface PublicProduct {
  id: number; name: string; description: string | null
  productType: string; price: number; stock: number
  imageUrl: string | null; createdAt: string
}

interface ProductReview {
  id: number; memberName: string; rating: number; content: string; createdAt: string
}

interface PageResponse<T> { content: T[]; totalElements: number; totalPages: number; number: number }

const TYPE_LABELS: Record<string, string> = {
  EBOOK: '전자책', BUSINESS_CARD: '명함', OFFICE_SUPPLY: '사무용품', DESIGN_TEMPLATE: '디자인 템플릿',
}

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0)
  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      {[1,2,3,4,5].map(i => (
        <span
          key={i}
          onClick={() => onChange?.(i)}
          onMouseEnter={() => onChange && setHover(i)}
          onMouseLeave={() => onChange && setHover(0)}
          style={{
            fontSize: 22, cursor: onChange ? 'pointer' : 'default',
            color: i <= (hover || value) ? '#f59e0b' : '#d1d5db',
            transition: 'color 0.1s',
          }}
        >★</span>
      ))}
    </div>
  )
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const token = localStorage.getItem('ploy_token')

  const [product, setProduct] = useState<PublicProduct | null>(null)
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [canReview, setCanReview] = useState(false)
  const [hasReviewed, setHasReviewed] = useState(false)
  const [loading, setLoading] = useState(true)

  const [rating, setRating] = useState(5)
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitDone, setSubmitDone] = useState(false)

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      axios.get<PublicProduct>(`/api/products/${id}`),
      axios.get<PageResponse<ProductReview>>(`/api/reviews/products/${id}`),
      isAuthenticated
        ? axios.get<{ canReview: boolean; hasReviewed: boolean }>(`/api/reviews/products/${id}/can-review`, { headers: authHeaders })
        : Promise.resolve(null),
    ]).then(([prod, rev, status]) => {
      setProduct(prod.data)
      setReviews(rev.data.content)
      setTotalReviews(rev.data.totalElements)
      if (status) {
        setCanReview(status.data.canReview)
        setHasReviewed(status.data.hasReviewed)
      }
    }).catch(() => navigate('/shop'))
      .finally(() => setLoading(false))
  }, [id, isAuthenticated, submitDone])

  const handleSubmitReview = async () => {
    if (!content.trim()) { setSubmitError('리뷰 내용을 입력해주세요.'); return }
    setSubmitting(true); setSubmitError('')
    try {
      await axios.post(`/api/reviews/products/${id}`, { rating, content }, { headers: authHeaders })
      setContent(''); setRating(5)
      setSubmitDone(v => !v) // re-fetch
    } catch (e: any) {
      const msg = e.response?.data?.message ?? e.response?.status
      if (e.response?.status === 403) setSubmitError('구매한 상품에만 리뷰를 작성할 수 있습니다.')
      else if (e.response?.status === 409) setSubmitError('이미 리뷰를 작성하셨습니다.')
      else setSubmitError('리뷰 저장에 실패했습니다. (' + msg + ')')
    } finally { setSubmitting(false) }
  }

  if (loading) return (
    <Layout><div style={{ textAlign: 'center', padding: '120px 0', color: '#9ca39c' }}>불러오는 중...</div></Layout>
  )
  if (!product) return null

  const soldOut = product.stock === 0
  const isPurchasable = ['EBOOK', 'OFFICE_SUPPLY'].includes(product.productType)
  const avgRating = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null

  return (
    <Layout>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Back */}
        <button onClick={() => navigate('/shop')} style={{ background: 'none', border: 'none', color: '#6b7b6b', fontSize: 14, cursor: 'pointer', marginBottom: 24, padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
          ← 상품 목록으로
        </button>

        {/* Product Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 40, marginBottom: 56, alignItems: 'start' }}>

          {/* Image */}
          <div style={{ borderRadius: 16, overflow: 'hidden', background: '#f8f9f8', aspectRatio: '4/3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {product.imageUrl
              ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <div style={{ fontSize: 64, opacity: 0.25 }}>📦</div>
            }
          </div>

          {/* Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <span style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 99, fontSize: 12, fontWeight: 600, background: '#ecfdf5', color: '#065f46', alignSelf: 'flex-start' }}>
              {TYPE_LABELS[product.productType] ?? product.productType}
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: '#1a2e1a', margin: 0, lineHeight: 1.3 }}>{product.name}</h1>

            {avgRating && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Stars value={Math.round(Number(avgRating))} />
                <span style={{ fontSize: 14, color: '#6b7b6b' }}>{avgRating} ({totalReviews}개 리뷰)</span>
              </div>
            )}

            {product.description && (
              <p style={{ fontSize: 15, color: '#4b5b4b', lineHeight: 1.7, margin: 0 }}>{product.description}</p>
            )}

            <div style={{ fontSize: 28, fontWeight: 800, color: '#1a2e1a' }}>
              {product.price === 0 ? '무료' : `${Number(product.price).toLocaleString()}원`}
            </div>

            <div style={{ fontSize: 13, color: soldOut ? '#e11d48' : '#6b7b6b' }}>
              {soldOut ? '품절' : `재고 ${product.stock}개`}
            </div>

            <button
              disabled={soldOut}
              onClick={() => { window.location.href = isPurchasable ? '/shop/purchase' : '/start' }}
              style={{
                padding: '14px 28px', borderRadius: 10, border: 'none', fontSize: 15, fontWeight: 700,
                cursor: soldOut ? 'not-allowed' : 'pointer',
                background: soldOut ? '#e5e7e5' : isPurchasable ? '#1a2e1a' : '#3DD9B3',
                color: soldOut ? '#9ca39c' : '#fff',
              }}
            >
              {soldOut ? '품절' : isPurchasable ? '구매하기' : '문의하기'}
            </button>
          </div>
        </motion.div>

        {/* Reviews Section */}
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1a2e1a', margin: '0 0 24px' }}>
            리뷰 {totalReviews > 0 && <span style={{ color: '#3DD9B3' }}>{totalReviews}</span>}
          </h2>

          {/* Review Form */}
          {isAuthenticated && canReview && (
            <div style={{ background: '#f8fbf8', border: '1px solid #e4e9e4', borderRadius: 12, padding: 24, marginBottom: 32 }}>
              <p style={{ fontWeight: 700, fontSize: 15, color: '#1a2e1a', margin: '0 0 16px' }}>리뷰 작성</p>
              <div style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 13, color: '#6b7b6b', margin: '0 0 6px' }}>별점</p>
                <Stars value={rating} onChange={setRating} />
              </div>
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="상품에 대한 솔직한 리뷰를 작성해주세요..."
                style={{ width: '100%', minHeight: 100, padding: '10px 12px', border: '1px solid #d1d5d1', borderRadius: 8, fontSize: 14, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: '#fff' }}
              />
              {submitError && <p style={{ color: '#e11d48', fontSize: 13, margin: '8px 0 0' }}>{submitError}</p>}
              <button
                onClick={handleSubmitReview}
                disabled={submitting}
                style={{ marginTop: 12, padding: '10px 24px', background: '#3DD9B3', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                {submitting ? '저장 중...' : '리뷰 등록'}
              </button>
            </div>
          )}

          {isAuthenticated && hasReviewed && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: '#166534' }}>
              ✓ 이 상품에 리뷰를 작성하셨습니다.
            </div>
          )}

          {isAuthenticated && !canReview && !hasReviewed && (
            <div style={{ background: '#fafafa', border: '1px solid #e4e9e4', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: '#6b7b6b' }}>
              구매 완료 후 리뷰를 작성할 수 있습니다.
            </div>
          )}

          {!isAuthenticated && (
            <div style={{ background: '#fafafa', border: '1px solid #e4e9e4', borderRadius: 10, padding: '14px 18px', marginBottom: 24, fontSize: 14, color: '#6b7b6b' }}>
              <a href="/login" style={{ color: '#3DD9B3', fontWeight: 600 }}>로그인</a> 후 구매하시면 리뷰를 작성할 수 있습니다.
            </div>
          )}

          {/* Review List */}
          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#9ca39c', fontSize: 14 }}>
              아직 리뷰가 없습니다. 첫 리뷰를 작성해보세요!
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {reviews.map(r => (
                <div key={r.id} style={{ background: '#fff', border: '1px solid #e4e9e4', borderRadius: 12, padding: '18px 20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#3DD9B3,#2dba9a)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 13, fontWeight: 700 }}>
                        {r.memberName.charAt(0)}
                      </div>
                      <span style={{ fontSize: 14, fontWeight: 600, color: '#1a2e1a' }}>{r.memberName}</span>
                      <Stars value={r.rating} />
                    </div>
                    <span style={{ fontSize: 12, color: '#9ca39c' }}>{formatDate(r.createdAt)}</span>
                  </div>
                  {r.content && <p style={{ fontSize: 14, color: '#4b5b4b', lineHeight: 1.7, margin: 0 }}>{r.content}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
