import { useState, useEffect, useCallback } from 'react'
import {
  getProducts, createProduct, updateProduct, updateProductVisibility, deleteProduct,
  type ConsoleProductListItem, type ProductUpsertRequest,
} from '../api/consoleApi'
import { Pagination, SearchIcon, useDebounce, formatDate } from '../components/ui/TablePage'

const TYPE_LABELS: Record<string, string> = {
  EBOOK: '전자책', BUSINESS_CARD: '명함', OFFICE_SUPPLY: '사무용품', DESIGN_TEMPLATE: '디자인템플릿',
  DIY_FURNITURE: 'DIY/가구', SMALL_APPLIANCE: '소형가전', DAILY_SUPPLIES: '생활잡화',
}
const ALL_TYPES = ['EBOOK', 'BUSINESS_CARD', 'OFFICE_SUPPLY', 'DESIGN_TEMPLATE', 'DIY_FURNITURE', 'SMALL_APPLIANCE', 'DAILY_SUPPLIES']

const EMPTY_FORM: ProductUpsertRequest = { name: '', description: '', productType: 'EBOOK', price: 0, stock: 0, imageUrl: '', visible: true }

function ProductModal({ open, initial, onClose, onSaved }: {
  open: boolean
  initial: ConsoleProductListItem | null
  onClose: () => void
  onSaved: (item: ConsoleProductListItem) => void
}) {
  const [form, setForm] = useState<ProductUpsertRequest>(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) { setError(''); return }
    if (initial) {
      setForm({
        name: initial.name, description: initial.description ?? '',
        productType: initial.productType, price: initial.price,
        stock: initial.stock, imageUrl: initial.imageUrl ?? '', visible: initial.visible,
      })
    } else {
      setForm(EMPTY_FORM)
    }
  }, [open, initial])

  const set = (k: keyof ProductUpsertRequest, v: string | number | boolean) =>
    setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name.trim()) { setError('상품명을 입력해 주세요.'); return }
    setSaving(true); setError('')
    try {
      const req = { ...form, price: Number(form.price), stock: Number(form.stock), imageUrl: form.imageUrl || undefined, description: form.description || undefined }
      const item = initial ? await updateProduct(initial.id, req) : await createProduct(req)
      onSaved(item)
    } catch {
      setError('저장에 실패했습니다.')
    } finally { setSaving(false) }
  }

  if (!open) return null
  return (
    <div className="cs-modal-backdrop" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="cs-modal" style={{ maxWidth: 480, width: '100%' }}>
        <p className="cs-modal-title">{initial ? '상품 수정' : '상품 등록'}</p>
        {error && <p style={{ color: '#E11D48', fontSize: 13, marginBottom: 12 }}>{error}</p>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cs-text-2)', display: 'block', marginBottom: 4 }}>상품명 *</label>
            <input className="cs-filter-select" style={{ width: '100%', boxSizing: 'border-box' }} value={form.name} onChange={e => set('name', e.target.value)} placeholder="상품명" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cs-text-2)', display: 'block', marginBottom: 4 }}>설명</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} placeholder="상품 설명..." style={{ width: '100%', minHeight: 72, padding: '8px 10px', border: '1px solid var(--cs-border)', borderRadius: 'var(--cs-radius-sm)', fontSize: 13, fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', background: 'var(--cs-bg)' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--cs-text-2)', display: 'block', marginBottom: 4 }}>유형</label>
              <select className="cs-filter-select" style={{ width: '100%' }} value={form.productType} onChange={e => set('productType', e.target.value)}>
                {ALL_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--cs-text-2)', display: 'block', marginBottom: 4 }}>노출</label>
              <select className="cs-filter-select" style={{ width: '100%' }} value={String(form.visible)} onChange={e => set('visible', e.target.value === 'true')}>
                <option value="true">노출</option>
                <option value="false">숨김</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div>
              <label style={{ fontSize: 12, color: 'var(--cs-text-2)', display: 'block', marginBottom: 4 }}>가격 (원)</label>
              <input type="number" className="cs-filter-select" style={{ width: '100%', boxSizing: 'border-box' }} value={form.price} onChange={e => set('price', e.target.value)} min={0} />
            </div>
            <div>
              <label style={{ fontSize: 12, color: 'var(--cs-text-2)', display: 'block', marginBottom: 4 }}>재고</label>
              <input type="number" className="cs-filter-select" style={{ width: '100%', boxSizing: 'border-box' }} value={form.stock} onChange={e => set('stock', e.target.value)} min={0} />
            </div>
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--cs-text-2)', display: 'block', marginBottom: 4 }}>이미지 URL</label>
            <input className="cs-filter-select" style={{ width: '100%', boxSizing: 'border-box' }} value={form.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="https://..." />
          </div>
        </div>
        <div className="cs-modal-actions" style={{ marginTop: 20 }}>
          <button className="cs-btn cs-btn-secondary" onClick={onClose} disabled={saving}>취소</button>
          <button className="cs-btn cs-btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Products() {
  const [items, setItems] = useState<ConsoleProductListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [visibleFilter, setVisibleFilter] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ConsoleProductListItem | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getProducts(page, SIZE, typeFilter || undefined, visibleFilter || undefined, debouncedQuery || undefined)
      setItems(res.content); setTotal(res.totalElements); setTotalPages(res.totalPages)
    } finally { setLoading(false) }
  }, [page, typeFilter, visibleFilter, debouncedQuery])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [typeFilter, visibleFilter, debouncedQuery])

  const openCreate = () => { setEditTarget(null); setModalOpen(true) }
  const openEdit = (item: ConsoleProductListItem) => { setEditTarget(item); setModalOpen(true) }

  const handleSaved = (item: ConsoleProductListItem) => {
    setItems(prev => {
      const idx = prev.findIndex(p => p.id === item.id)
      if (idx >= 0) { const next = [...prev]; next[idx] = item; return next }
      return [item, ...prev]
    })
    setModalOpen(false)
  }

  const handleToggleVisible = async (item: ConsoleProductListItem) => {
    const updated = await updateProductVisibility(item.id, !item.visible)
    setItems(prev => prev.map(p => p.id === updated.id ? updated : p))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('이 상품을 삭제하시겠습니까?')) return
    setDeleting(id)
    try { await deleteProduct(id); setItems(prev => prev.filter(p => p.id !== id)) }
    finally { setDeleting(null) }
  }

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">상품 관리</h1>
          <p className="cs-page-subtitle">전자책, 명함 등 상품의 등록, 수정, 재고 및 노출 여부를 관리합니다.</p>
        </div>
        <button className="cs-btn cs-btn-primary" onClick={openCreate}>+ 상품 등록</button>
      </div>
      <div className="cs-filter-bar">
        <div className="cs-filter-search">
          <SearchIcon />
          <input placeholder="상품명 검색..." value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <select className="cs-filter-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="">전체 유형</option>
          {ALL_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
        </select>
        <select className="cs-filter-select" value={visibleFilter} onChange={e => setVisibleFilter(e.target.value)}>
          <option value="">전체 노출</option>
          <option value="true">노출</option>
          <option value="false">숨김</option>
        </select>
      </div>
      <div className="cs-table-wrap">
        {loading ? <div className="cs-loading">불러오는 중...</div>
        : items.length === 0 ? <div className="cs-table-empty">상품이 없습니다.</div>
        : (
          <table className="cs-table">
            <thead><tr><th>상품명 / 유형</th><th>가격</th><th>재고</th><th>노출</th><th>등록일</th><th>액션</th></tr></thead>
            <tbody>
              {items.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      {p.imageUrl && <img src={p.imageUrl} alt="" style={{ width: 36, height: 36, objectFit: 'cover', borderRadius: 6, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none' }} />}
                      <div>
                        <div className="cs-table-name">{p.name}</div>
                        <div className="cs-table-sub">{TYPE_LABELS[p.productType] ?? p.productType}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{p.price.toLocaleString()}원</td>
                  <td style={{ fontSize: 13, color: p.stock === 0 ? '#E11D48' : 'var(--cs-text-2)' }}>{p.stock}</td>
                  <td>
                    <button
                      className={`cs-badge ${p.visible ? 'cs-badge-mint' : 'cs-badge-gray'}`}
                      style={{ cursor: 'pointer', border: 'none', background: undefined }}
                      onClick={() => handleToggleVisible(p)}
                    >
                      {p.visible ? '노출' : '숨김'}
                    </button>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)' }}>{formatDate(p.createdAt)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="cs-table-action-btn" onClick={() => openEdit(p)}>수정</button>
                      <button className="cs-table-action-btn danger" disabled={deleting === p.id} onClick={() => handleDelete(p.id)}>삭제</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && totalPages > 1 && <Pagination page={page} totalPages={totalPages} totalElements={total} size={SIZE} onChange={setPage} />}
      </div>
      <ProductModal open={modalOpen} initial={editTarget} onClose={() => setModalOpen(false)} onSaved={handleSaved} />
    </div>
  )
}
