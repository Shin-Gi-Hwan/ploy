import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import Layout from '../components/layout/Layout'

// ── Types ──────────────────────────────────────────────────────────────────────

interface PublicProduct {
  id: number
  name: string
  description: string | null
  productType: string
  price: number
  stock: number
  imageUrl: string | null
  createdAt: string
}

// ── Constants ──────────────────────────────────────────────────────────────────

const TYPE_LABELS: Record<string, string> = {
  EBOOK: '전자책',
  BUSINESS_CARD: '명함',
  OFFICE_SUPPLY: '사무용품',
  DESIGN_TEMPLATE: '디자인 템플릿',
}

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  EBOOK:           { bg: '#ecfdf5', text: '#065f46' },
  BUSINESS_CARD:   { bg: '#eff6ff', text: '#1e40af' },
  OFFICE_SUPPLY:   { bg: '#fff7ed', text: '#9a3412' },
  DESIGN_TEMPLATE: { bg: '#faf5ff', text: '#6b21a8' },
}

const ALL_TYPES = ['EBOOK', 'BUSINESS_CARD', 'OFFICE_SUPPLY', 'DESIGN_TEMPLATE']

// ── Product Card ───────────────────────────────────────────────────────────────

function ProductCard({ product }: { product: PublicProduct }) {
  const typeColor = TYPE_COLORS[product.productType] ?? { bg: '#f3f4f6', text: '#374151' }
  const soldOut = product.stock === 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      whileHover={!soldOut ? { y: -4, boxShadow: '0 8px 32px rgba(0,0,0,0.10)' } : {}}
      style={{
        background: '#fff',
        border: '1px solid #e4e9e4',
        borderRadius: 16,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        opacity: soldOut ? 0.65 : 1,
        transition: 'box-shadow 0.18s',
      }}
    >
      {/* Image */}
      <div style={{
        width: '100%', aspectRatio: '4/3',
        background: '#f8f9f8',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', position: 'relative',
      }}>
        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <ProductPlaceholder type={product.productType} />
        }
        {soldOut && (
          <div style={{
            position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 15, letterSpacing: 1 }}>품절</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 20px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
        {/* Type badge */}
        <span style={{
          display: 'inline-block', alignSelf: 'flex-start',
          padding: '3px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
          background: typeColor.bg, color: typeColor.text,
        }}>
          {TYPE_LABELS[product.productType] ?? product.productType}
        </span>

        {/* Name */}
        <p style={{ fontSize: 15, fontWeight: 700, color: '#1a2e1a', lineHeight: 1.4, margin: 0 }}>
          {product.name}
        </p>

        {/* Description */}
        {product.description && (
          <p style={{
            fontSize: 13, color: '#6b7b6b', lineHeight: 1.6, margin: 0,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {product.description}
          </p>
        )}

        {/* Price + CTA */}
        {(() => {
          const isPurchasable = ['EBOOK', 'OFFICE_SUPPLY'].includes(product.productType)
          const btnLabel = soldOut ? '품절' : isPurchasable ? '구매하기' : '문의하기'
          const btnHref  = isPurchasable ? '/shop/purchase' : '/start'
          return (
            <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f0f4f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 17, fontWeight: 800, color: '#1a2e1a' }}>
                {product.price === 0 ? '무료' : `${Number(product.price).toLocaleString()}원`}
              </span>
              <button
                disabled={soldOut}
                onClick={() => { window.location.href = btnHref }}
                style={{
                  padding: '8px 16px', borderRadius: 8, border: 'none',
                  background: soldOut ? '#e5e7e5' : isPurchasable ? '#1a2e1a' : '#3DD9B3',
                  color: soldOut ? '#9ca39c' : '#fff',
                  fontSize: 13, fontWeight: 600, cursor: soldOut ? 'not-allowed' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {btnLabel}
              </button>
            </div>
          )
        })()}
      </div>
    </motion.div>
  )
}

// ── Placeholder icon per type ──────────────────────────────────────────────────

function ProductPlaceholder({ type }: { type: string }) {
  const icons: Record<string, string> = {
    EBOOK: '📘', BUSINESS_CARD: '🪪', OFFICE_SUPPLY: '✏️', DESIGN_TEMPLATE: '🎨',
  }
  return (
    <div style={{ fontSize: 48, opacity: 0.35 }}>{icons[type] ?? '📦'}</div>
  )
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function Shop() {
  const [products, setProducts] = useState<PublicProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('')

  useEffect(() => {
    setLoading(true)
    axios.get<PublicProduct[]>('/api/products', { params: { type: typeFilter || undefined } })
      .then(r => setProducts(r.data))
      .catch(() => setError('상품을 불러오지 못했습니다.'))
      .finally(() => setLoading(false))
  }, [typeFilter])

  return (
    <Layout>
      <section style={{ maxWidth: 1080, margin: '0 auto', padding: '56px 24px 80px' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: 48 }}
        >
          <h1 style={{ fontSize: 'clamp(28px, 5vw, 40px)', fontWeight: 800, color: '#1a2e1a', margin: 0, marginBottom: 12 }}>
            상품 둘러보기
          </h1>
          <p style={{ fontSize: 16, color: '#6b7b6b', margin: 0 }}>
            Ploy에서 제공하는 디자인 서비스 상품들을 확인해보세요.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 36 }}>
          {[{ label: '전체', value: '' }, ...ALL_TYPES.map(t => ({ label: TYPE_LABELS[t], value: t }))].map(tab => (
            <button
              key={tab.value}
              onClick={() => setTypeFilter(tab.value)}
              style={{
                padding: '8px 20px', borderRadius: 99, border: '1.5px solid',
                borderColor: typeFilter === tab.value ? '#3DD9B3' : '#d1d5d1',
                background: typeFilter === tab.value ? '#3DD9B3' : '#fff',
                color: typeFilter === tab.value ? '#fff' : '#4b5b4b',
                fontSize: 13.5, fontWeight: 600, cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca39c', fontSize: 15 }}>
            불러오는 중...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#e11d48', fontSize: 15 }}>
            {error}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca39c' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
            <p style={{ fontSize: 15, margin: 0 }}>등록된 상품이 없습니다.</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={typeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 24,
              }}
            >
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </motion.div>
          </AnimatePresence>
        )}
      </section>
    </Layout>
  )
}
