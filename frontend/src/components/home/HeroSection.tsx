import Button from '../ui/Button'

const AVATARS = ['SR', 'DK', 'ML', 'PM', 'JR']

export default function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="container">
        <div className="hero-inner">

          <div className="hero-badge">
            <span className="hero-badge-dot" aria-hidden="true" />
            Done-for-you design work
          </div>

          <h1 id="hero-title" className="hero-title">
            Design work,<br />
            <span className="hero-title-accent">handled.</span>
          </h1>

          <p className="hero-desc">
            Business cards, presentations, and websites — designed by professionals
            and delivered straight to your inbox. No design experience needed.
          </p>

          <div className="hero-actions">
            <Button as="a" href="/start" size="lg">
              Start a Project →
            </Button>
            <Button as="a" href="/#how-it-works" variant="secondary" size="lg"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              See how it works
            </Button>
          </div>

          <div className="hero-social-proof">
            <div className="hero-avatars" aria-hidden="true">
              {AVATARS.map((a) => (
                <div key={a} className="hero-avatar">{a[0]}</div>
              ))}
            </div>
            <p className="hero-proof-text">
              Trusted by <strong>500+</strong> freelancers and small businesses
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
