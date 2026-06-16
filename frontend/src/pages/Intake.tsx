import { useState, type FormEvent } from 'react'
import Layout from '../components/layout/Layout'
import Breadcrumb from '../components/ui/Breadcrumb'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Textarea from '../components/ui/Textarea'
import Select from '../components/ui/Select'
import Card from '../components/ui/Card'
import { submitBrief, getErrorMessage } from '../lib/api'
import type { IntakeRequest, IntakeResponse } from '../types/api'

const TYPE_OPTIONS = [
  { value: 'BUSINESS_CARD', label: 'Business Card' },
  { value: 'PRESENTATION',  label: 'Presentation / Pitch Deck' },
  { value: 'WEBSITE',       label: 'Website' },
]

const INITIAL: IntakeRequest = {
  name: '', email: '', phone: '',
  type: 'BUSINESS_CARD',
  visionText: '', colorPreferences: '', styleRefs: '', additionalNotes: '',
}

// ─── Success state ─────────────────────────────────────────────────────────────

function SuccessState({ result }: { result: IntakeResponse }) {
  const trackingUrl = `/track/${result.magicToken}`
  const fullUrl = `${window.location.origin}${trackingUrl}`

  function copyLink() {
    navigator.clipboard.writeText(fullUrl).catch(() => {})
  }

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'center' }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--mint-50)', border: '2px solid var(--mint-200)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto var(--space-6)',
      }}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12l5 5L20 7" stroke="var(--mint-500)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 'var(--space-3)' }}>
        Brief received!
      </h1>
      <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 'var(--space-8)' }}>
        We're reviewing your project brief and will get started shortly.
        Use the link below to track your project status and download files when they're ready.
      </p>

      <Card style={{ marginBottom: 'var(--space-5)', textAlign: 'left' }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 'var(--space-3)' }}>
          Your tracking link
        </p>
        <div style={{
          display: 'flex', gap: 'var(--space-2)', alignItems: 'center',
          padding: 'var(--space-3)', background: 'var(--bg-subtle)',
          borderRadius: 'var(--radius-md)', border: '1px solid var(--border-default)',
        }}>
          <code style={{ flex: 1, fontSize: 13, color: 'var(--text-primary)', wordBreak: 'break-all' }}>
            {fullUrl}
          </code>
          <button
            onClick={copyLink}
            style={{
              flexShrink: 0, padding: '6px 10px', background: '#fff',
              border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
              fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)', cursor: 'pointer',
            }}
          >
            Copy
          </button>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 'var(--space-3)' }}>
          We also sent this link to your email. Bookmark it to check back anytime.
        </p>
      </Card>

      <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Button as="a" href={trackingUrl} size="md">
          View project status →
        </Button>
        <Button as="a" href="/" variant="secondary" size="md">
          Back to home
        </Button>
      </div>

      <p style={{ marginTop: 'var(--space-5)', fontSize: 13, color: 'var(--text-muted)' }}>
        Project #{result.projectId}
      </p>
    </div>
  )
}

// ─── Form section wrapper ──────────────────────────────────────────────────────

function FormSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 'var(--space-8)' }}>
      <h2 style={{
        fontSize: 13, fontWeight: 600, color: 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.06em',
        paddingBottom: 'var(--space-4)',
        borderBottom: '1px solid var(--border-default)',
        marginBottom: 'var(--space-5)',
      }}>
        {title}
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
        {children}
      </div>
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Intake() {
  const [form, setForm] = useState<IntakeRequest>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<IntakeResponse | null>(null)

  function setField<K extends keyof IntakeRequest>(field: K) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }))
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const data = await submitBrief(form)
      setResult(data)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div style={{ background: 'var(--bg-subtle)', borderBottom: '1px solid var(--border-default)', padding: 'var(--space-4) 0' }}>
        <div className="container">
          <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Start a Project' }]} />
        </div>
      </div>

      <div style={{ padding: 'var(--space-12) 0 var(--space-20)' }}>
        <div className="container">
          {result ? (
            <SuccessState result={result} />
          ) : (
            <div style={{ maxWidth: 620, margin: '0 auto' }}>

              {/* Page header */}
              <div style={{ marginBottom: 'var(--space-10)' }}>
                <span className="section-label">New project</span>
                <h1 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.025em', lineHeight: 1.2, marginBottom: 'var(--space-3)' }}>
                  Tell us about your project
                </h1>
                <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  The more detail you share, the better we can match your vision. Takes about 3 minutes.
                </p>
              </div>

              {/* Error alert */}
              {error && (
                <div className="alert alert-error" role="alert" style={{ marginBottom: 'var(--space-6)' }}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0, marginTop: 1 }}>
                    <path d="M8 5v3M8 11h.01M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  {error}
                </div>
              )}

              <Card>
                <form onSubmit={handleSubmit} noValidate>
                  <FormSection title="About you">
                    <Input
                      label="Your name"
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={setField('name')}
                      required
                      autoComplete="name"
                    />
                    <Input
                      label="Email address"
                      type="email"
                      placeholder="jane@example.com"
                      value={form.email}
                      onChange={setField('email')}
                      required
                      autoComplete="email"
                    />
                    <Input
                      label="Phone"
                      type="tel"
                      placeholder="+1 555 000 0000"
                      value={form.phone}
                      onChange={setField('phone')}
                      autoComplete="tel"
                    />
                  </FormSection>

                  <FormSection title="Your project">
                    <Select
                      label="What do you need?"
                      options={TYPE_OPTIONS}
                      value={form.type}
                      onChange={setField('type')}
                      required
                    />
                    <Textarea
                      label="Describe your vision"
                      hint="What's this for? What do you want people to feel when they see it?"
                      placeholder="I run a yoga studio and want a card that feels calm, premium, and modern…"
                      value={form.visionText}
                      onChange={setField('visionText')}
                      required
                      style={{ minHeight: 110 }}
                    />
                    <Input
                      label="Colors and style"
                      hint="Any colors you love (or hate)? Words that describe your vibe?"
                      placeholder="Warm earth tones, no blues, something like Aesop's branding"
                      value={form.colorPreferences}
                      onChange={setField('colorPreferences')}
                    />
                    <Textarea
                      label="References"
                      hint="Paste links to designs you admire, or name brands with a look you like"
                      placeholder="https://… or 'something like Notion's website'"
                      value={form.styleRefs}
                      onChange={setField('styleRefs')}
                      style={{ minHeight: 80 }}
                    />
                    <Textarea
                      label="Anything else?"
                      placeholder="Special requirements, deadline, number of variants needed…"
                      value={form.additionalNotes}
                      onChange={setField('additionalNotes')}
                      style={{ minHeight: 80 }}
                    />
                  </FormSection>

                  <Button
                    type="submit"
                    size="lg"
                    loading={submitting}
                    disabled={submitting}
                    style={{ width: '100%' }}
                  >
                    {submitting ? 'Submitting…' : 'Submit brief →'}
                  </Button>

                  <p style={{ marginTop: 'var(--space-4)', fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
                    By submitting you agree we'll contact you about your project.
                  </p>
                </form>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
