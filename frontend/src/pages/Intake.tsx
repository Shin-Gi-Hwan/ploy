import { useState, type FormEvent } from 'react'
import axios from 'axios'

type ProjectType = 'BUSINESS_CARD' | 'PRESENTATION' | 'WEBSITE'

interface IntakeResponse {
  projectId: number
  magicToken: string
  trackingUrl: string
}

type FormState = {
  name: string
  email: string
  phone: string
  type: ProjectType | ''
  visionText: string
  colorPreferences: string
  styleRefs: string
  additionalNotes: string
}

const INITIAL: FormState = {
  name: '', email: '', phone: '', type: '',
  visionText: '', colorPreferences: '', styleRefs: '', additionalNotes: '',
}

export default function Intake() {
  const [form, setForm] = useState<FormState>(INITIAL)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<IntakeResponse | null>(null)

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { data } = await axios.post<IntakeResponse>('/api/projects', form)
      setResult(data)
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 429) {
          setError("You've submitted too many briefs recently. Please wait an hour and try again.")
        } else {
          setError(err.response?.data || 'Something went wrong. Please try again.')
        }
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  // Confirmation screen — shown regardless of whether the email delivered
  if (result) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
            Brief received!
          </h1>
          <p style={{ color: '#4b5563', lineHeight: 1.7, marginBottom: 28 }}>
            We're reviewing your brief and will get started shortly. Track your project status
            and download your files using this link:
          </p>
          <a
            href={`/track/${result.magicToken}`}
            style={styles.trackingLink}
          >
            View your project →
          </a>
          <p style={{ marginTop: 24, fontSize: 13, color: '#9ca3af' }}>
            We also sent this link to your email — but bookmark it just in case.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
          Tell us about your project
        </h1>
        <p style={{ color: '#6b7280', marginBottom: 32, lineHeight: 1.6 }}>
          Share your vision and we'll take it from there. Takes about 3 minutes.
        </p>

        {error && (
          <div style={styles.errorBanner}>{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>About you</legend>
            <Field label="Your name *" htmlFor="name">
              <input id="name" style={styles.input} value={form.name}
                onChange={set('name')} required placeholder="Jane Smith" />
            </Field>
            <Field label="Email address *" htmlFor="email">
              <input id="email" type="email" style={styles.input} value={form.email}
                onChange={set('email')} required placeholder="jane@example.com" />
            </Field>
            <Field label="Phone (optional)" htmlFor="phone">
              <input id="phone" type="tel" style={styles.input} value={form.phone}
                onChange={set('phone')} placeholder="+1 555 000 0000" />
            </Field>
          </fieldset>

          <fieldset style={styles.fieldset}>
            <legend style={styles.legend}>Your project</legend>
            <Field label="What do you need? *" htmlFor="type">
              <select id="type" style={styles.input} value={form.type}
                onChange={set('type')} required>
                <option value="">Select one...</option>
                <option value="BUSINESS_CARD">Business Card</option>
                <option value="PRESENTATION">Presentation / Pitch Deck</option>
                <option value="WEBSITE">Website</option>
              </select>
            </Field>
            <Field label="Describe your vision *" htmlFor="visionText"
              hint="What's this for? What do you want people to feel when they see it?">
              <textarea id="visionText" style={{ ...styles.input, minHeight: 100 }}
                value={form.visionText} onChange={set('visionText')} required
                placeholder="I run a yoga studio and want a card that feels calm, premium, and modern..." />
            </Field>
            <Field label="Colors and style" htmlFor="colorPreferences"
              hint="Any colors you love (or hate)? Words that describe your vibe?">
              <input id="colorPreferences" style={styles.input} value={form.colorPreferences}
                onChange={set('colorPreferences')}
                placeholder="Warm earth tones, no blues, something like Aesop's branding" />
            </Field>
            <Field label="References" htmlFor="styleRefs"
              hint="Paste links to designs you admire, or name brands with a look you like">
              <textarea id="styleRefs" style={{ ...styles.input, minHeight: 80 }}
                value={form.styleRefs} onChange={set('styleRefs')}
                placeholder="https://... or 'something like Notion's website'" />
            </Field>
            <Field label="Anything else?" htmlFor="additionalNotes">
              <textarea id="additionalNotes" style={{ ...styles.input, minHeight: 80 }}
                value={form.additionalNotes} onChange={set('additionalNotes')}
                placeholder="Special requirements, deadline, number of card variants needed..." />
            </Field>
          </fieldset>

          <button type="submit" style={styles.submitBtn} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit brief →'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Field({ label, htmlFor, hint, children }: {
  label: string; htmlFor: string; hint?: string; children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={htmlFor} style={styles.label}>{label}</label>
      {hint && <p style={styles.hint}>{hint}</p>}
      {children}
    </div>
  )
}

const styles = {
  page: { fontFamily: 'system-ui, sans-serif', minHeight: '100vh', background: '#f9fafb', padding: '40px 24px' } as const,
  card: { maxWidth: 600, margin: '0 auto', background: '#fff', borderRadius: 16, padding: '40px 36px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' } as const,
  fieldset: { border: 'none', padding: 0, margin: '0 0 28px 0' } as const,
  legend: { fontSize: 13, fontWeight: 700, color: '#6b7280', letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 16 },
  label: { display: 'block', fontSize: 14, fontWeight: 600, color: '#374151', marginBottom: 4 } as const,
  hint: { fontSize: 12, color: '#9ca3af', marginBottom: 6, marginTop: 0 } as const,
  input: { width: '100%', boxSizing: 'border-box' as const, padding: '10px 12px', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15, fontFamily: 'inherit', outline: 'none', resize: 'vertical' as const },
  errorBanner: { background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', borderRadius: 8, padding: '12px 16px', marginBottom: 24, fontSize: 14 } as const,
  submitBtn: { width: '100%', background: '#111827', color: '#fff', border: 'none', padding: '14px', borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: 'pointer', marginTop: 8 } as const,
  trackingLink: { display: 'inline-block', background: '#111827', color: '#fff', padding: '14px 28px', borderRadius: 8, fontWeight: 600, fontSize: 16, textDecoration: 'none' } as const,
}
