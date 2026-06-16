import { useTranslation } from 'react-i18next'
import type { ProjectStatus } from '../../types/api'
import { PROJECT_STATUS_ORDER } from '../../types/api'

interface StatusStepperProps {
  status: ProjectStatus
}

export default function StatusStepper({ status }: StatusStepperProps) {
  const { t } = useTranslation()
  const currentIndex = PROJECT_STATUS_ORDER.indexOf(status)

  return (
    <div className="stepper" aria-label={t('tracking.progress')} role="list">
      {PROJECT_STATUS_ORDER.map((step, i) => {
        const done   = i < currentIndex
        const active = i === currentIndex
        const isLast = i === PROJECT_STATUS_ORDER.length - 1

        return (
          <div key={step} className="stepper-step" role="listitem">
            {!isLast && (
              <div className="stepper-line-wrap">
                <div className={`stepper-line${done ? ' done' : ''}`} />
              </div>
            )}

            <div
              className={`stepper-indicator${done ? ' done' : active ? ' active' : ''}`}
              aria-hidden="true"
            >
              {done ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7l3.5 3.5 5.5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : active ? (
                <span className="stepper-dot" />
              ) : null}
            </div>

            <div className="stepper-content">
              <p className={`stepper-title${(!done && !active) ? ' muted' : ''}`}>
                {t(`status.${step}`)}
              </p>
              {active && (
                <p className="stepper-desc">{t(`status.descriptions.${step}`)}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
