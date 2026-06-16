import type { ProjectStatus } from '../../types/api'
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_ORDER } from '../../types/api'

const STATUS_DESCRIPTIONS: Record<ProjectStatus, string> = {
  BRIEF_SUBMITTED: "We've received your brief and it's in the queue.",
  IN_PROGRESS:     "Your project is actively being worked on.",
  REVIEW:          "Your files are ready. Download below and let us know if you need a revision.",
  DELIVERED:       "Project complete. Thank you for working with us!",
}

interface StatusStepperProps {
  status: ProjectStatus
}

export default function StatusStepper({ status }: StatusStepperProps) {
  const currentIndex = PROJECT_STATUS_ORDER.indexOf(status)

  return (
    <div className="stepper" aria-label="Project status" role="list">
      {PROJECT_STATUS_ORDER.map((step, i) => {
        const done   = i < currentIndex
        const active = i === currentIndex
        const isLast = i === PROJECT_STATUS_ORDER.length - 1

        return (
          <div key={step} className="stepper-step" role="listitem">
            {/* Connector line */}
            {!isLast && (
              <div className="stepper-line-wrap">
                <div className={`stepper-line${done ? ' done' : ''}`} />
              </div>
            )}

            {/* Circle indicator */}
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

            {/* Label */}
            <div className="stepper-content">
              <p className={`stepper-title${(!done && !active) ? ' muted' : ''}`}>
                {PROJECT_STATUS_LABELS[step]}
              </p>
              {active && (
                <p className="stepper-desc">{STATUS_DESCRIPTIONS[step]}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
