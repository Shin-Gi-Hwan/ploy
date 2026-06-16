import Button from '../ui/Button'

const SERVICES = [
  {
    icon: '💳',
    title: 'Business Card',
    desc: 'A card that makes a first impression worth remembering. Print-ready files delivered in multiple formats.',
    turnaround: '2–3 days',
    includes: ['2 design concepts', 'Print-ready PDF', 'Digital version', '1 revision'],
  },
  {
    icon: '📊',
    title: 'Presentation',
    desc: 'Pitch decks, investor briefs, and company overviews. Consistent slides that tell your story visually.',
    turnaround: '3–5 days',
    includes: ['Up to 20 slides', 'PowerPoint + PDF', 'Brand-matched style', '1 revision'],
  },
  {
    icon: '🌐',
    title: 'Website',
    desc: 'A clean, fast site built for results — portfolio, landing page, or small business presence.',
    turnaround: '5–7 days',
    includes: ['Up to 5 pages', 'Mobile responsive', 'SEO ready', '1 revision'],
  },
]

export default function ServicesSection() {
  return (
    <section id="services" className="services" aria-labelledby="services-title">
      <div className="container">
        <div className="section-header">
          <span className="section-label">Services</span>
          <h2 id="services-title" className="section-title">
            Pick your project type
          </h2>
          <p className="section-desc">
            Three focused services done exceptionally well.
            Tell us what you need — we'll handle the rest.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <div key={s.title} className="service-card">
              <div className="service-icon" aria-hidden="true">{s.icon}</div>
              <h3 className="service-title">{s.title}</h3>
              <p className="service-desc">{s.desc}</p>

              <ul style={{
                margin: 'var(--space-5) 0 0',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-2)',
              }}>
                {s.includes.map((item) => (
                  <li key={item} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-2)',
                    fontSize: 14,
                    color: 'var(--text-secondary)',
                  }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" style={{ flexShrink: 0, color: 'var(--mint-500)' }}>
                      <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="service-meta">
                <div className="service-meta-item">
                  Turnaround: <span className="service-meta-value">{s.turnaround}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 'var(--space-10)' }}>
          <Button as="a" href="/start" size="lg">
            Start a Project →
          </Button>
        </div>
      </div>
    </section>
  )
}
