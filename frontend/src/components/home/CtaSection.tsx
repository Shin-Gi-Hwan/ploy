export default function CtaSection() {
  return (
    <section className="cta-section" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-box">
          <p className="section-label" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Ready to start?
          </p>
          <h2 id="cta-title" className="cta-title">
            Your next project is<br />one brief away.
          </h2>
          <p className="cta-desc">
            Fill out a short form, and we'll take it from there.<br />
            No design experience. No back-and-forth. Just results.
          </p>
          <div className="cta-actions">
            <a href="/start" className="btn btn-lg btn-cta-primary">
              Start a Project →
            </a>
            <a href="/#how-it-works" className="btn btn-lg btn-cta-secondary"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              See how it works
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
