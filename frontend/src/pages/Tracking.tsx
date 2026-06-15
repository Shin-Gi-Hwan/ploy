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
    return <PageShell><p style={{ color: '#6b7280' }}>Loading your project…</p></PageShell>
  }

  if (notFound || !data) {
    return (
      <PageShell>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
          Project not found
        </h1>
        <p style={{ color: '#6b7280', lineHeight: 1.7 }}>
          We couldn't find this project. Check your email for the correct link, or{' '}
          <a href="/" style={{ color: '#111827' }}>contact us</a>.
        </p>
      </PageShell>
    )
  }

  const currentStep = STATUS_STEPS.indexOf(data.status)

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb', padding: '40px 24px' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <p style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>
          {TYPE_LABELS[data.type]} · Project #{data.projectId}
        </p>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 32 }}>
          Hi {data.clientName} — here's your project status
        </h1>

        {/* Progress stepper */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '28px 24px', marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          {STATUS_STEPS.map((step, i) => {
            const done = i < currentStep
            const active = i === currentStep
            return (
              <div key={step} style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: i < STATUS_STEPS.length - 1 ? 20 : 0 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: done ? '#111827' : active ? '#111827' : '#e5e7eb',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {done
                    ? <span style={{ color: '#fff', fontSize: 14 }}>✓</span>
                    : <span style={{ width: 8, height: 8, borderRadius: '50%', background: active ? '#fff' : '#9ca3af' }} />
                  }
                </div>
                <div>
                  <p style={{ fontWeight: active ? 700 : 400, color: (done || active) ? '#111827' : '#9ca3af', margin: 0, fontSize: 15 }}>
                    {STATUS_LABELS[step]}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        {/* Deliverable download */}
        {data.latestDeliverable ? (
          <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>
              Your files — v{data.latestDeliverable.version}
            </p>
            {data.latestDeliverable.note && (
              <p style={{ color: '#374151', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>
                "{data.latestDeliverable.note}"
              </p>
            )}
            <a
              href={data.latestDeliverable.downloadUrl}
              download
              style={{
                display: 'inline-block', background: '#111827', color: '#fff',
                padding: '12px 24px', borderRadius: 8, fontWeight: 600,
                fontSize: 15, textDecoration: 'none',
              }}
            >
              Download files ↓
            </a>
          </div>
        ) : (
          <div style={{ background: '#fff', borderRadius: 12, padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.06)', color: '#6b7280', fontSize: 15 }}>
            Your files will appear here once they're ready.
          </div>
        )}
      </div>
    </div>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb', padding: '80px 24px' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>{children}</div>
    </div>
  )
}
