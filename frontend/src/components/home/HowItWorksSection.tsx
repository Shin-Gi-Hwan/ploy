import { useTranslation } from 'react-i18next'

export default function HowItWorksSection() {
  const { t } = useTranslation()
  const steps = t('howItWorks.steps', { returnObjects: true }) as Array<{ n: string; title: string; desc: string }>

  return (
    <section id="how-it-works" className="how-it-works" aria-labelledby="how-title">
      <div className="container">
        <div className="section-header">
          <span className="section-label">{t('howItWorks.label')}</span>
          <h2 id="how-title" className="section-title">
            {t('howItWorks.title').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h2>
          <p className="section-desc">{t('howItWorks.subtitle')}</p>
        </div>

        <div className="steps-grid">
          {steps.map((step) => (
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
