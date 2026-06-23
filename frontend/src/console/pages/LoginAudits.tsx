import { useState, useEffect, useCallback } from 'react'
import {
  getLoginAudits,
  type ConsoleLoginAuditListItem,
} from '../api/consoleApi'
import { Pagination, formatDateTime } from '../components/ui/TablePage'

const PROVIDER_LABELS: Record<string, string> = {
  google: 'Google',
  kakao: '카카오',
  naver: '네이버',
  email: '이메일',
}

const PROVIDER_COLOR: Record<string, string> = {
  google: '#4285F4',
  kakao: '#FEE500',
  naver: '#03C75A',
  email: 'var(--cs-text-3)',
}

const PROVIDER_TEXT_COLOR: Record<string, string> = {
  kakao: '#3C1E1E',
}

function ProviderBadge({ provider }: { provider: string }) {
  const label = PROVIDER_LABELS[provider] ?? provider
  const bg = PROVIDER_COLOR[provider] ?? 'var(--cs-surface)'
  const color = PROVIDER_TEXT_COLOR[provider] ?? '#fff'
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 10px', borderRadius: 99, fontSize: 11, fontWeight: 600,
      background: bg, color,
    }}>
      {provider === 'google' && <GoogleIcon />}
      {provider === 'kakao'  && <KakaoIcon />}
      {provider === 'naver'  && <NaverIcon />}
      {label}
    </span>
  )
}

function GoogleIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  )
}

function KakaoIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#3C1E1E">
      <path d="M12 3C6.477 3 2 6.477 2 11c0 2.99 1.658 5.602 4.166 7.193L5.1 21.5l3.898-2.082A11.16 11.16 0 0012 19c5.523 0 10-3.477 10-8S17.523 3 12 3z"/>
    </svg>
  )
}

function NaverIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff">
      <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z"/>
    </svg>
  )
}

export default function LoginAudits() {
  const [items, setItems] = useState<ConsoleLoginAuditListItem[]>([])
  const [total, setTotal] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [providerFilter, setProviderFilter] = useState('')
  const [successFilter, setSuccessFilter] = useState('')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const SIZE = 20

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const successVal = successFilter === 'true' ? true : successFilter === 'false' ? false : undefined
      const res = await getLoginAudits(page, SIZE, providerFilter || undefined, successVal, fromDate || undefined, toDate || undefined)
      setItems(res.content); setTotal(res.totalElements); setTotalPages(res.totalPages)
    } finally { setLoading(false) }
  }, [page, providerFilter, successFilter, fromDate, toDate])

  useEffect(() => { load() }, [load])
  useEffect(() => { setPage(0) }, [providerFilter, successFilter, fromDate, toDate])

  const hasFilter = providerFilter || successFilter || fromDate || toDate

  return (
    <div>
      <div className="cs-page-header">
        <div className="cs-page-title-group">
          <h1 className="cs-page-title">로그인 이력</h1>
          <p className="cs-page-subtitle">소셜 로그인(Google, 카카오, 네이버) 및 이메일 로그인 이력을 조회합니다.</p>
        </div>
        <div style={{ fontSize: 13, color: 'var(--cs-text-3)' }}>총 {total.toLocaleString()}건</div>
      </div>

      <div className="cs-filter-bar" style={{ flexWrap: 'wrap' }}>
        <select className="cs-filter-select" value={providerFilter} onChange={e => setProviderFilter(e.target.value)}>
          <option value="">전체 제공자</option>
          <option value="google">Google</option>
          <option value="kakao">카카오</option>
          <option value="naver">네이버</option>
          <option value="email">이메일</option>
        </select>
        <select className="cs-filter-select" value={successFilter} onChange={e => setSuccessFilter(e.target.value)}>
          <option value="">전체 결과</option>
          <option value="true">성공</option>
          <option value="false">실패</option>
        </select>
        <input type="date" className="cs-filter-select" value={fromDate} onChange={e => setFromDate(e.target.value)} style={{ minWidth: 130 }} />
        <input type="date" className="cs-filter-select" value={toDate}   onChange={e => setToDate(e.target.value)}   style={{ minWidth: 130 }} />
        {hasFilter && (
          <button className="cs-btn cs-btn-secondary" style={{ fontSize: 12 }}
            onClick={() => { setProviderFilter(''); setSuccessFilter(''); setFromDate(''); setToDate('') }}>
            필터 초기화
          </button>
        )}
      </div>

      <div className="cs-table-wrap">
        {loading ? <div className="cs-loading">불러오는 중...</div>
        : items.length === 0 ? <div className="cs-table-empty">로그인 이력이 없습니다.</div>
        : (
          <table className="cs-table">
            <thead>
              <tr>
                <th>제공자</th>
                <th>결과</th>
                <th>회원</th>
                <th>IP</th>
                <th>User-Agent</th>
                <th>일시</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id}>
                  <td><ProviderBadge provider={item.provider} /></td>
                  <td>
                    {item.success
                      ? <span className="cs-badge cs-badge-mint" style={{ fontSize: 11 }}>성공</span>
                      : (
                        <div>
                          <span className="cs-badge cs-badge-red" style={{ fontSize: 11 }}>실패</span>
                          {item.failureReason && (
                            <div className="cs-table-sub" style={{ color: '#E11D48', marginTop: 2 }}>{item.failureReason}</div>
                          )}
                        </div>
                      )
                    }
                  </td>
                  <td>
                    {item.memberEmail
                      ? <>
                          <div className="cs-table-name" style={{ fontSize: 13 }}>{item.memberName ?? '—'}</div>
                          <div className="cs-table-sub mono">{item.memberEmail}</div>
                        </>
                      : <span style={{ color: 'var(--cs-text-3)', fontSize: 12 }}>—</span>
                    }
                  </td>
                  <td style={{ fontSize: 12, fontFamily: 'monospace', color: 'var(--cs-text-3)' }}>
                    {item.ipAddress ?? '—'}
                  </td>
                  <td style={{ fontSize: 11, color: 'var(--cs-text-3)', maxWidth: 200 }}>
                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.userAgent ? item.userAgent.slice(0, 80) : '—'}
                    </div>
                  </td>
                  <td style={{ fontSize: 13, color: 'var(--cs-text-2)', whiteSpace: 'nowrap' }}>
                    {formatDateTime(item.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} totalElements={total} size={SIZE} onChange={setPage} />
        )}
      </div>
    </div>
  )
}
