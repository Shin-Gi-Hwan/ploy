const STEPS = [
  {
    n: '01',
    title: 'Share your brief',
    desc: "Tell us what you need — your brand, your audience, and references you love. Takes 3 minutes. No design jargon required.",
  },
  {
    n: '02',
    title: 'We get to work',
    desc: "A professional designer picks up your brief and creates something polished within a few days — not weeks.",
  },
  {
    n: '03',
    title: 'Review and download',
    desc: "You get a private tracking link. Review your files, request one round of revisions, then download and go.",
  },
]

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="how-it-works" aria-labelledby="how-title">
      <div className="container">
        <div className="section-header">
          <span className="section-label">How it works</span>
          <h2 id="how-title" className="section-title">
            From brief to deliverable<br />in three steps
          </h2>
          <p className="section-desc">
            Simple, fast, and transparent. No hidden steps, no chasing replies.
          </p>
        </div>

        <div className="steps-grid">
          {STEPS.map((step) => (
            <div key={step.n} className="step-card">
              <div className="step-number" aria-hidden="true">{step.n}</div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
