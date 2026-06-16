import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import Breadcrumb from '../components/ui/Breadcrumb'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { StatusBadge } from '../components/ui/Badge'
import Spinner from '../components/ui/Spinner'
import StatusStepper from '../components/tracking/StatusStepper'
import { getTracking } from '../lib/api'
import type { TrackingResponse } from '../types/api'
import { PROJECT_TYPE_LABELS } from '../types/api'

// ─── States ───────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div style={{ textAlign: 'center', maxWidth: 440, margin: '0 auto' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--gray-100)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        margin: '0 auto var(--space-6)',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 9v4M12 17h.01M21 12A9 9 0 1 1 3 12a9 9 0 0 1 18 0z" stroke="var(--gray-400)" strokeWidth="1.75" strokeLinecap="round" />
        </svg>
      </div>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 'var(--space-3)' }}>
        Project not found
      </h1>
      <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
        We couldn't find a project with this tracking link.
        Check your email for the correct link.
      </p>
      <Button as="a" href="/" variant="secondary">← Back to home</Button>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Tracking() {
  const { token } = useParams<{ token: string }>()
  const [data, setData] = useState<TrackingResponse | null>(null)
  const [loading, setLoading]   = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!token) { setNotFound(true); setLoading(false); return }

    getTracking(token)
      .then(setData)
      .catch((err) => {
        if (err?.response?.status === 404) setNotFound(true)
      })
      .finally(() => setLoading(false))
  }, [token])

  return (
    <Layout>
      <div style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Project Status' }]} />
        </div>
      </div>

      <div style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
        <div className="container">
          {loading  && <Spinner fullPage />}
          {notFound && !loading && <NotFound />}

          {data && !loading && (
            <div style={{ maxWidth: 600, margin: '0 auto' }}>

              {/* Header */}
              <div style={{ marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)', flexWrap: 'wrap' }}>
                  <span className="section-label" style={{ margin: 0 }}>
                    {PROJECT_TYPE_LABELS[data.type]} · #{data.projectId}
                  </span>
                  <StatusBadge status={data.status} />
                </div>
                <h1 style={{ fontSize: 'clamp(26px, 4vw, 36px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                  Hi {data.clientName} —<br />
                  here's your project.
                </h1>
              </div>

              {/* Status stepper */}
              <Card style={{ marginBottom: 'var(--space-5)' }}>
                <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-6)' }}>
                  Progress
                </h2>
                <StatusStepper status={data.status} />
              </Card>

              {/* Deliverable */}
              {data.latestDeliverable ? (
                <Card>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--space-4)', flexWrap: 'wrap', marginBottom: 'var(--space-5)' }}>
                    <div>
                      <h2 style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-2)' }}>
                        Your files
                      </h2>
                      <span style={{
                        display: 'inline-block', padding: '2px 8px',
                        background: 'var(--mint-50)', color: 'var(--mint-700)',
                        borderRadius: 'var(--radius-full)', fontSize: 12, fontWeight: 600,
                      }}>
                        Version {data.latestDeliverable.version}
                      </span>
                    </div>
                  </div>

                  {data.latestDeliverable.note && (
                    <blockquote style={{
                      margin: '0 0 var(--space-5)',
                      padding: 'var(--space-4)',
                      background: 'var(--bg-subtle)',
                      borderLeft: '3px solid var(--mint-300)',
                      borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                      fontSize: 15,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                    }}>
                      {data.latestDeliverable.note}
                    </blockquote>
                  )}

                  <Button
                    as="a"
                    href={data.latestDeliverable.downloadUrl}
                    size="md"
                    download
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="M8 2v8M5 7l3 3 3-3M2 13h12" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Download files
                  </Button>
                </Card>
              ) : (
                <Card>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-muted)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                        <path d="M10 2v10M7 9l3 3 3-3M3 17h14" stroke="var(--gray-400)" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 2 }}>
                        Files not ready yet
                      </p>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                        Your download will appear here once the work is complete.
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Back link */}
              <div style={{ marginTop: 'var(--space-8)', textAlign: 'center' }}>
                <Link to="/" style={{ fontSize: 14, color: 'var(--text-muted)', textDecoration: 'underline', textUnderlineOffset: 3 }}>
                  ← Back to Ploy
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
