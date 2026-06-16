import { Link } from 'react-router-dom'

const PORTFOLIO_ITEMS = [
  {
    id: 1,
    type: 'Business Card',
    client: 'Aria Wellness Studio',
    description: 'Minimalist card with sage green and warm cream — matched to their spa brand identity.',
    tags: ['Print', 'Branding'],
  },
  {
    id: 2,
    type: 'Presentation',
    client: 'NovaSeed Ventures',
    description: '18-slide investor deck with data visualizations, consistent typography, and a strong narrative arc.',
    tags: ['Slides', 'Pitch Deck'],
  },
  {
    id: 3,
    type: 'Website',
    client: 'Marcus Lee — Freelance Photographer',
    description: 'Portfolio site with full-bleed gallery, contact form, and fast mobile load times.',
    tags: ['Web', 'Portfolio'],
  },
]

const TESTIMONIALS = [
  {
    quote: "I sent over a few Pinterest boards and got back something I actually felt proud to hand out. Took three days.",
    author: 'Aria Chen, Aria Wellness Studio',
  },
  {
    quote: "Our pitch deck was holding us back. The new one got us three follow-up meetings in a week.",
    author: 'Daniel Park, NovaSeed Ventures',
  },
]

const C = {
  cream:   '#f5f1eb',
  surface: '#faf8f5',
  ink:     '#1a1715',
  mid:     '#736b63',
  low:     '#a89e94',
  border:  '#e4ddd4',
  sage:    '#8a9e86',
}

export default function Portfolio() {
  return (
    <div style={{ background: C.cream, minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '0 32px' }}>

        {/* Hero */}
        <header style={{ padding: '96px 0 72px', borderBottom: `1px solid ${C.border}` }}>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 11,
            fontWeight: 500,
            color: C.sage,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}>
            Done-For-You Creative Services
          </p>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: 'clamp(52px, 7vw, 80px)',
            fontWeight: 500,
            lineHeight: 1.05,
            color: C.ink,
            letterSpacing: '-0.02em',
            marginBottom: 28,
          }}>
            You share the vision.<br />
            We make it look<br />
            <em style={{ fontStyle: 'italic', color: C.mid }}>professional.</em>
          </h1>
          <p style={{
            fontSize: 17,
            color: C.mid,
            maxWidth: 520,
            lineHeight: 1.8,
            marginBottom: 48,
            fontWeight: 300,
          }}>
            Business cards, presentations, and websites — designed for freelancers
            and small business owners who don't have time to wrestle with Canva
            or trust a random Fiverr gig.
          </p>
          <Link to="/start" style={btnStyle}>
            Get Started
          </Link>
        </header>

        {/* How it works */}
        <section style={{ padding: '72px 0', borderBottom: `1px solid ${C.border}` }}>
          <Label>How it works</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 48, marginTop: 40 }}>
            {[
              { n: '01', title: 'Share your vision', body: "Tell us what you're going for — your brand, your vibe, references you love. No design experience needed." },
              { n: '02', title: 'We get to work', body: 'We create something polished based on your brief. You hear from us within a few days, not weeks.' },
              { n: '03', title: 'Download and go', body: 'You get a private link to review and download your files. Revision included.' },
            ].map(({ n, title, body }) => (
              <div key={n}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 400, color: C.border, display: 'block', marginBottom: 16, lineHeight: 1 }}>
                  {n}
                </span>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 500, color: C.ink, marginBottom: 10 }}>
                  {title}
                </h3>
                <p style={{ fontSize: 14, color: C.mid, lineHeight: 1.8, fontWeight: 300 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Portfolio */}
        <section style={{ padding: '72px 0', borderBottom: `1px solid ${C.border}` }}>
          <Label>Recent work</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, marginTop: 40 }}>
            {PORTFOLIO_ITEMS.map((item) => (
              <div key={item.id} style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '28px 24px',
              }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
                  {item.tags.map((tag) => (
                    <span key={tag} style={{
                      fontSize: 10,
                      fontWeight: 500,
                      color: C.low,
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      background: C.cream,
                      padding: '4px 10px',
                      borderRadius: 20,
                      border: `1px solid ${C.border}`,
                    }}>{tag}</span>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: C.low, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>{item.type}</p>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: C.ink, marginBottom: 10 }}>
                  {item.client}
                </h3>
                <p style={{ fontSize: 13, color: C.mid, lineHeight: 1.75, fontWeight: 300 }}>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section style={{ padding: '72px 0', borderBottom: `1px solid ${C.border}` }}>
          <Label>What clients say</Label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24, marginTop: 40 }}>
            {TESTIMONIALS.map((t) => (
              <div key={t.author} style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                padding: '36px 32px',
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 22,
                  fontStyle: 'italic',
                  color: C.ink,
                  lineHeight: 1.6,
                  marginBottom: 20,
                  fontWeight: 400,
                }}>
                  "{t.quote}"
                </p>
                <p style={{ fontSize: 12, fontWeight: 500, color: C.low, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  — {t.author}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section style={{ padding: '96px 0', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(36px, 5vw, 56px)',
            fontWeight: 500,
            color: C.ink,
            marginBottom: 16,
            letterSpacing: '-0.01em',
          }}>
            Ready to look the part?
          </h2>
          <p style={{ color: C.mid, marginBottom: 44, fontSize: 16, fontWeight: 300 }}>
            Share your brief. We'll handle the rest.
          </p>
          <Link to="/start" style={btnStyle}>
            Get Started
          </Link>
        </section>

      </div>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Inter', sans-serif",
      fontSize: 11,
      fontWeight: 500,
      color: '#8a9e86',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
    }}>
      {children}
    </p>
  )
}

const btnStyle: React.CSSProperties = {
  display: 'inline-block',
  background: '#1a1715',
  color: '#faf8f5',
  padding: '14px 36px',
  borderRadius: 6,
  fontWeight: 500,
  fontSize: 14,
  letterSpacing: '0.06em',
  textDecoration: 'none',
  fontFamily: "'Inter', sans-serif",
}
