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

const C = {
  cream:   '#f5f1eb',
  surface: '#fdfcfa',
  ink:     '#1a1715',
  mid:     '#736b63',
  low:     '#a89e94',
  border:  '#e4ddd4',
  sage:    '#8a9e86',
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

  if (result) {
    return (
      <div style={S.page}>
        <div style={{ ...S.card, textAlign: 'center', padding: '64px 48px' }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            border: `1.5px solid ${C.sage}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 28px',
            color: C.sage, fontSize: 20,
          }}>✓</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 500, color: C.ink, marginBottom: 16 }}>
            Brief received.
          </h1>
          <p style={{ color: C.mid, lineHeight: 1.8, marginBottom: 36, fontSize: 15, fontWeight: 300, maxWidth: 400, margin: '0 auto 36px' }}>
            We're reviewing your brief and will get started shortly. Track your project
            status and download your files using this link:
          </p>
          <a href={`/track/${result.magicToken}`} style={S.btn}>
            View your project
          </a>
          <p style={{ marginTop: 28, fontSize: 12, color: C.low, letterSpacing: '0.04em' }}>
            We also sent this link to your email — bookmark it just in case.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={S.page}>
      <div style={S.card}>
        <div style={{ marginBottom: 36 }}>
          <p style={{ fontSize: 11, fontWeight: 500, color: C.sage, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>
            Start your project
          </p>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 500, color: C.ink, marginBottom: 10 }}>
            Tell us about your project
          </h1>
          <p style={{ color: C.mid, lineHeight: 1.8, fontWeight: 300, fontSize: 15 }}>
            Share your vision and we'll take it from there. Takes about 3 minutes.
          </p>
        </div>

        {error && (
          <div style={S.errorBanner}>{error}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Section label="About you">
            <Field label="Your name" htmlFor="name" required>
              <input id="name" style={S.input} value={form.name}
                onChange={set('name')} required placeholder="Jane Smith" />
            </Field>
            <Field label="Email address" htmlFor="email" required>
              <input id="email" type="email" style={S.input} value={form.email}
                onChange={set('email')} required placeholder="jane@example.com" />
            </Field>
            <Field label="Phone" htmlFor="phone">
              <input id="phone" type="tel" style={S.input} value={form.phone}
                onChange={set('phone')} placeholder="+1 555 000 0000" />
            </Field>
          </Section>

          <Section label="Your project">
            <Field label="What do you need?" htmlFor="type" required>
              <select id="type" style={S.input} value={form.type}
                onChange={set('type')} required>
                <option value="">Select one...</option>
                <option value="BUSINESS_CARD">Business Card</option>
                <option value="PRESENTATION">Presentation / Pitch Deck</option>
                <option value="WEBSITE">Website</option>
              </select>
            </Field>
            <Field label="Describe your vision" htmlFor="visionText" required
              hint="What's this for? What do you want people to feel when they see it?">
              <textarea id="visionText" style={{ ...S.input, minHeight: 100 }}
                value={form.visionText} onChange={set('visionText')} required
                placeholder="I run a yoga studio and want a card that feels calm, premium, and modern..." />
            </Field>
            <Field label="Colors and style" htmlFor="colorPreferences"
              hint="Any colors you love (or hate)? Words that describe your vibe?">
              <input id="colorPreferences" style={S.input} value={form.colorPreferences}
                onChange={set('colorPreferences')}
                placeholder="Warm earth tones, no blues, something like Aesop's branding" />
            </Field>
            <Field label="References" htmlFor="styleRefs"
              hint="Paste links to designs you admire, or name brands with a look you like">
              <textarea id="styleRefs" style={{ ...S.input, minHeight: 80 }}
                value={form.styleRefs} onChange={set('styleRefs')}
                placeholder="https://... or 'something like Notion's website'" />
            </Field>
            <Field label="Anything else?" htmlFor="additionalNotes">
              <textarea id="additionalNotes" style={{ ...S.input, minHeight: 80 }}
                value={form.additionalNotes} onChange={set('additionalNotes')}
                placeholder="Special requirements, deadline, number of card variants needed..." />
            </Field>
          </Section>

          <button type="submit" style={S.btn} disabled={submitting}>
            {submitting ? 'Submitting…' : 'Submit brief'}
          </button>
        </form>
      </div>
    </div>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <p style={{
        fontSize: 10, fontWeight: 500, color: C.low,
        letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20,
        paddingBottom: 12, borderBottom: `1px solid ${C.border}`,
      }}>
        {label}
      </p>
      {children}
    </div>
  )
}

function Field({ label, htmlFor, hint, required, children }: {
  label: string; htmlFor: string; hint?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={htmlFor} style={{
        display: 'block', fontSize: 13, fontWeight: 500,
        color: C.ink, marginBottom: hint ? 4 : 8,
      }}>
        {label}{required && <span style={{ color: C.low, marginLeft: 4 }}>*</span>}
      </label>
      {hint && <p style={{ fontSize: 12, color: C.low, marginBottom: 8, lineHeight: 1.5 }}>{hint}</p>}
      {children}
    </div>
  )
}

const S = {
  page: {
    fontFamily: "'Inter', system-ui, sans-serif",
    minHeight: '100vh',
    background: '#f5f1eb',
    padding: '56px 24px',
  } as const,
  card: {
    maxWidth: 580,
    margin: '0 auto',
    background: '#fdfcfa',
    borderRadius: 12,
    padding: '48px 44px',
    border: '1px solid #e4ddd4',
  } as const,
  input: {
    width: '100%',
    boxSizing: 'border-box' as const,
    padding: '11px 14px',
    border: '1px solid #e4ddd4',
    borderRadius: 6,
    fontSize: 14,
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    resize: 'vertical' as const,
    background: '#f5f1eb',
    color: '#1a1715',
  },
  errorBanner: {
    background: '#fdf2f2',
    border: '1px solid #e4c5c5',
    color: '#8b4040',
    borderRadius: 6,
    padding: '12px 16px',
    marginBottom: 24,
    fontSize: 13,
  } as const,
  btn: {
    display: 'block',
    width: '100%',
    background: '#1a1715',
    color: '#faf8f5',
    border: 'none',
    padding: '15px',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
    letterSpacing: '0.08em',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center' as const,
    fontFamily: "'Inter', sans-serif",
  },
}
