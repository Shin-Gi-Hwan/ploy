import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

type Status = 'BRIEF_SUBMITTED' | 'IN_PROGRESS' | 'REVIEW' | 'DELIVERED'
type ProjectType = 'BUSINESS_CARD' | 'PRESENTATION' | 'WEBSITE'

interface DeliverableView {
  id: number
  version: number
  note: string | null
  downloadUrl: string
}

interface TrackingData {
  projectId: number
  type: ProjectType
  status: Status
  clientName: string
  latestDeliverable: DeliverableView | null
}

const STATUS_LABELS: Record<Status, string> = {
  BRIEF_SUBMITTED: 'Brief received',
  IN_PROGRESS:     'In progress',
  REVIEW:          'Ready for your review',
  DELIVERED:       'Delivered',
}

const STATUS_STEPS: Status[] = ['BRIEF_SUBMITTED', 'IN_PROGRESS', 'REVIEW', 'DELIVERED']

const TYPE_LABELS: Record<ProjectType, string> = {
  BUSINESS_CARD: 'Business Card',
  PRESENTATION:  'Presentation',
  WEBSITE:       'Website',
}

const C = {
  cream:   '#f5f1eb',
  surface: '#fdfcfa',
  ink:     '#1a1715',
  mid:     '#736b63',
  low:     '#a89e94',
  border:  '#e4ddd4',
  sage:    '#8a9e86',
}

export default function Tracking() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    axios.get<TrackingData>(`/api/projects/track/${token}`)
      .then(res => setData(res.data))
      .catch(err => {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          setNotFound(true)
        }
      })
      .finally(() => setLoading(false))
  }, [token])

  if (loading) {
    return (
      <PageShell>
        <p style={{ color: C.low, fontSize: 14, fontWeight: 300 }}>Loading your project…</p>
      </PageShell>
    )
  }

  if (notFound || !data) {
    return (
      <PageShell>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, fontWeight: 500, color: C.ink, marginBottom: 16 }}>
          Project not found
        </h1>
        <p style={{ color: C.mid, lineHeight: 1.8, fontWeight: 300, fontSize: 15 }}>
          We couldn't find this project. Check your email for the correct link, or{' '}
          <a href="/" style={{ color: C.ink, textDecoration: 'underline', textUnderlineOffset: 3 }}>contact us</a>.
        </p>
      </PageShell>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(data.status)

  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: '100vh',
      background: C.cream,
      padding: '56px 24px',
    }}>
      <div style={{ maxWidth: 580, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: C.sage, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
            {TYPE_LABELS[data.type]} · #{data.projectId}
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 500, color: C.ink, lineHeight: 1.2 }}>
            Hi {data.clientName} —<br />
            <span style={{ color: C.mid, fontStyle: 'italic' }}>here's your project.</span>
          </h1>
        </div>

        {/* Progress stepper */}
        <div style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 12,
          padding: '32px 28px',
          marginBottom: 20,
        }}>
          <p style={{ fontSize: 10, fontWeight: 500, color: C.low, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 24, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            Status
          </p>
          {STATUS_STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <div key={step} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: 16,
                marginBottom: i < STATUS_STEPS.length - 1 ? 20 : 0,
              }}>
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: done ? C.ink : 'transparent',
                  border: `1.5px solid ${done ? C.ink : active ? C.sage : C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {done
                    ? <span style={{ color: C.cream, fontSize: 11, lineHeight: 1 }}>✓</span>
                    : active
                      ? <span style={{ width: 7, height: 7, borderRadius: '50%', background: C.sage, display: 'block' }} />
                      : null
                  }
                </div>
                <p style={{
                  fontSize: 14,
                  fontWeight: active ? 500 : 300,
                  color: done ? C.ink : active ? C.ink : C.low,
                  margin: 0,
                  paddingTop: 2,
                  letterSpacing: active ? '0.01em' : 0,
                }}>
                  {STATUS_LABELS[step]}
                </p>
              </div>
            )
          })}
        </div>

        {/* Deliverable */}
        {data.latestDeliverable ? (
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '32px 28px',
          }}>
            <p style={{ fontSize: 10, fontWeight: 500, color: C.low, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
              Your files — v{data.latestDeliverable.version}
            </p>
            {data.latestDeliverable.note && (
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 18,
                fontStyle: 'italic',
                color: C.mid,
                lineHeight: 1.7,
                marginBottom: 24,
              }}>
                "{data.latestDeliverable.note}"
              </p>
            )}
            <a
              href={data.latestDeliverable.downloadUrl}
              download
              style={{
                display: 'inline-block',
                background: C.ink,
                color: '#faf8f5',
                padding: '13px 28px',
                borderRadius: 6,
                fontWeight: 500,
                fontSize: 13,
                letterSpacing: '0.08em',
                textDecoration: 'none',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Download files
            </a>
          </div>
        ) : (
          <div style={{
            background: C.surface,
            border: `1px solid ${C.border}`,
            borderRadius: 12,
            padding: '28px',
            color: C.low,
            fontSize: 14,
            fontWeight: 300,
            lineHeight: 1.7,
          }}>
            Your files will appear here once they're ready.
          </div>
        )}

      </div>
    </div>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontFamily: "'Inter', system-ui, sans-serif",
      minHeight: '100vh',
      background: '#f5f1eb',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>{children}</div>
    </div>
  )
}
