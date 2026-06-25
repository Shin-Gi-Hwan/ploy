import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/layout/DashboardLayout'
import { submitServiceRequest } from '../../lib/api'
import type { ServiceType } from '../../types/api'

const SERVICE_OPTIONS: { value: ServiceType; label: string; icon: string; desc: string }[] = [
  { value: 'BUSINESS_CARD', label: '명함', icon: '🪪', desc: '전문적인 명함 디자인' },
  { value: 'PRESENTATION', label: '프레젠테이션', icon: '📊', desc: 'PPT / Keynote 제작' },
  { value: 'WEBSITE', label: '웹사이트', icon: '🌐', desc: '랜딩 페이지 · 기업 홈페이지' },
  { value: 'LOGO', label: '로고', icon: '✏️', desc: '브랜드 아이덴티티 로고' },
  { value: 'DETAIL_PAGE', label: '상세페이지', icon: '🛍', desc: '쇼핑몰 제품 상세 이미지' },
  { value: 'MOBILE_APP', label: '모바일앱', icon: '📱', desc: 'UI/UX 디자인 · 앱 개발' },
]

type Step = 'type' | 'detail' | 'confirm'

interface FormData {
  serviceType: ServiceType | ''
  title: string
  description: string
  colorPreferences: string
  styleRefs: string
  additionalNotes: string
  deadline: string
}

const EMPTY: FormData = {
  serviceType: '', title: '', description: '',
  colorPreferences: '', styleRefs: '', additionalNotes: '', deadline: '',
}

export default function ClientRequest() {
  const navigate = useNavigate()
  const [step, setStep] = useState<Step>('type')
  const [form, setForm] = useState<FormData>(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  function set(key: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleSubmit() {
    if (!form.serviceType) return
    setSubmitting(true)
    setError('')
    try {
      const res = await submitServiceRequest({
        serviceType: form.serviceType,
        title: form.title,
        description: form.description,
        colorPreferences: form.colorPreferences || undefined,
        styleRefs: form.styleRefs || undefined,
        additionalNotes: form.additionalNotes || undefined,
        deadline: form.deadline || undefined,
      })
      navigate(`/client/projects/${res.projectId}`)
    } catch {
      setError('서비스 신청 중 오류가 발생했습니다. 다시 시도해 주세요.')
      setSubmitting(false)
    }
  }

  const selected = SERVICE_OPTIONS.find(o => o.value === form.serviceType)

  return (
    <DashboardLayout title="서비스 신청">
      <div className="client-section" style={{ maxWidth: 600, margin: '0 auto' }}>

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 0, marginBottom: 28 }}>
          {(['type', 'detail', 'confirm'] as Step[]).map((s, i) => {
            const labels = ['서비스 선택', '상세 정보', '최종 확인']
            const done = ['type', 'detail', 'confirm'].indexOf(step) > i
            const active = step === s
            return (
              <div key={s} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: done || active ? 'var(--mint-600)' : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700,
                    color: done || active ? '#fff' : '#9ca3af',
                  }}>
                    {done ? '✓' : i + 1}
                  </div>
                  <span style={{ fontSize: 11, color: active ? 'var(--mint-600)' : 'var(--text-tertiary)', fontWeight: active ? 700 : 400 }}>
                    {labels[i]}
                  </span>
                </div>
                {i < 2 && <div style={{ height: 2, flex: 1, background: done ? 'var(--mint-600)' : '#e5e7eb', marginBottom: 20 }} />}
              </div>
            )
          })}
        </div>

        {/* Step 1: Service type */}
        {step === 'type' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>어떤 서비스가 필요하신가요?</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {SERVICE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => set('serviceType', opt.value)}
                  style={{
                    textAlign: 'left', padding: '14px 16px', borderRadius: 10,
                    border: '2px solid',
                    borderColor: form.serviceType === opt.value ? 'var(--mint-600)' : 'var(--border-default)',
                    background: form.serviceType === opt.value ? 'var(--mint-50)' : '#fff',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{opt.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{opt.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2 }}>{opt.desc}</div>
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary btn-md"
              style={{ marginTop: 20, width: '100%' }}
              disabled={!form.serviceType}
              onClick={() => setStep('detail')}
            >
              다음 →
            </button>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 'detail' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>
              {selected?.icon} {selected?.label} 상세 정보
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-tertiary)', marginBottom: 20 }}>
              상세히 입력할수록 더 정확한 결과물을 받으실 수 있습니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  제목 <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <input
                  className="form-input"
                  placeholder="예) 스타트업 명함 디자인"
                  value={form.title}
                  onChange={e => set('title', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-default)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  요청 내용 <span style={{ color: 'var(--error)' }}>*</span>
                </label>
                <textarea
                  placeholder="원하시는 스타일, 필요한 내용, 참고 사항 등을 자유롭게 작성해 주세요."
                  value={form.description}
                  onChange={e => set('description', e.target.value)}
                  rows={5}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-default)', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  선호 색상 <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(선택)</span>
                </label>
                <input
                  placeholder="예) 민트, 네이비, 화이트"
                  value={form.colorPreferences}
                  onChange={e => set('colorPreferences', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-default)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  참고 자료 <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(선택)</span>
                </label>
                <input
                  placeholder="참고 URL 또는 설명"
                  value={form.styleRefs}
                  onChange={e => set('styleRefs', e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-default)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 6 }}>
                  희망 납기일 <span style={{ color: 'var(--text-tertiary)', fontWeight: 400 }}>(선택)</span>
                </label>
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => set('deadline', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 8, border: '1.5px solid var(--border-default)', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setStep('type')}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--border-default)', background: '#fff', fontSize: 14, cursor: 'pointer' }}
              >
                ← 이전
              </button>
              <button
                className="btn btn-primary btn-md"
                style={{ flex: 2 }}
                disabled={!form.title || !form.description}
                onClick={() => setStep('confirm')}
              >
                다음 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm */}
        {step === 'confirm' && (
          <div>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>신청 내용을 확인해 주세요</h2>

            <div style={{ background: '#fff', border: '1px solid var(--border-default)', borderRadius: 12, padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { label: '서비스', value: `${selected?.icon} ${selected?.label}` },
                { label: '제목', value: form.title },
                { label: '요청 내용', value: form.description },
                form.colorPreferences ? { label: '선호 색상', value: form.colorPreferences } : null,
                form.styleRefs ? { label: '참고 자료', value: form.styleRefs } : null,
                form.deadline ? { label: '희망 납기일', value: new Date(form.deadline).toLocaleDateString('ko-KR') } : null,
              ].filter(Boolean).map((row, i) => (
                <div key={i} style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)', minWidth: 80, paddingTop: 1 }}>{row!.label}</span>
                  <span style={{ fontSize: 13, color: 'var(--text-primary)', flex: 1, whiteSpace: 'pre-wrap' }}>{row!.value}</span>
                </div>
              ))}
            </div>

            {error && (
              <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', fontSize: 13 }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              <button
                onClick={() => setStep('detail')}
                disabled={submitting}
                style={{ flex: 1, padding: '10px', borderRadius: 8, border: '1.5px solid var(--border-default)', background: '#fff', fontSize: 14, cursor: 'pointer' }}
              >
                ← 수정
              </button>
              <button
                className="btn btn-primary btn-md"
                style={{ flex: 2 }}
                disabled={submitting}
                onClick={handleSubmit}
              >
                {submitting ? '신청 중...' : '서비스 신청하기 →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
