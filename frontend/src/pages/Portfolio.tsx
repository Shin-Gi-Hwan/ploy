import { Link } from 'react-router-dom'

// Portfolio entries are hardcoded in v1.
// Promote to a DB-backed PortfolioItem table in v2 when you have enough work.
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

export default function Portfolio() {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

      {/* Hero */}
      <header style={{ padding: '80px 0 60px', borderBottom: '1px solid #e5e7eb' }}>
        <p style={{ color: '#6b7280', fontSize: 14, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 16 }}>
          Done-For-You Creative Services
        </p>
        <h1 style={{ fontSize: 48, fontWeight: 700, lineHeight: 1.1, marginBottom: 20, color: '#111827' }}>
          You share the vision.<br />We make it look professional.
        </h1>
        <p style={{ fontSize: 18, color: '#4b5563', maxWidth: 560, lineHeight: 1.7, marginBottom: 36 }}>
          Business cards, presentations, and websites — designed for freelancers and small business owners
          who don't have time to wrestle with Canva or trust a random Fiverr gig.
        </p>
        <Link
          to="/start"
          style={{
            display: 'inline-block',
            background: '#111827',
            color: '#fff',
            padding: '14px 32px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 16,
            textDecoration: 'none',
          }}
        >
          Get Started →
        </Link>
      </header>

      {/* How it works */}
      <section style={{ padding: '60px 0', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, color: '#111827' }}>How it works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { step: '01', title: 'Share your vision', body: "Tell us what you're going for — your brand, your vibe, references you love. No design experience needed." },
            { step: '02', title: 'We get to work', body: 'We create something polished based on your brief. You hear from us within a few days, not weeks.' },
            { step: '03', title: 'Download and go', body: 'You get a private link to review and download your files. Revision included.' },
          ].map(({ step, title, body }) => (
            <div key={step}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', letterSpacing: 1, marginBottom: 8 }}>{step}</div>
              <h3 style={{ fontSize: 17, fontWeight: 600, marginBottom: 8, color: '#111827' }}>{title}</h3>
              <p style={{ color: '#6b7280', lineHeight: 1.6, fontSize: 15 }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio */}
      <section style={{ padding: '60px 0', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, color: '#111827' }}>Recent work</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {PORTFOLIO_ITEMS.map((item) => (
            <div key={item.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
                {item.tags.map((tag) => (
                  <span key={tag} style={{
                    fontSize: 12, fontWeight: 600, color: '#374151',
                    background: '#f3f4f6', padding: '3px 10px', borderRadius: 20,
                  }}>{tag}</span>
                ))}
              </div>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 6 }}>{item.type}</p>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', marginBottom: 10 }}>{item.client}</h3>
              <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '60px 0', borderBottom: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 32, color: '#111827' }}>What clients say</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
          {TESTIMONIALS.map((t) => (
            <div key={t.author} style={{ background: '#f9fafb', borderRadius: 12, padding: 28 }}>
              <p style={{ fontSize: 16, color: '#374151', lineHeight: 1.7, marginBottom: 16, fontStyle: 'italic' }}>
                "{t.quote}"
              </p>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>— {t.author}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: 32, fontWeight: 700, color: '#111827', marginBottom: 16 }}>
          Ready to look the part?
        </h2>
        <p style={{ color: '#6b7280', marginBottom: 36, fontSize: 16 }}>
          Share your brief. We'll handle the rest.
        </p>
        <Link
          to="/start"
          style={{
            display: 'inline-block',
            background: '#111827',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: 8,
            fontWeight: 600,
            fontSize: 17,
            textDecoration: 'none',
          }}
        >
          Get Started →
        </Link>
      </section>
    </div>
  )
}
